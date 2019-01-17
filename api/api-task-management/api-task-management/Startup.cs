using System;
using api_task_management.Hubs;
using api_task_management.Services;
using MedicalApi;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using Swashbuckle.AspNetCore.Swagger;

namespace api_task_management
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            var sew = configuration.GetSection("Seq").Value;

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.File($"{AppContext.BaseDirectory}/Logs/log-.txt", rollingInterval: RollingInterval.Day)
                .WriteTo.Seq(configuration.GetSection("Seq").Value)
                .CreateLogger();

            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        private string _tasksConnection;

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddSignalR();

            services.AddMvcCore()
                .AddVersionedApiExplorer(options =>
                {
                    options.SubstituteApiVersionInUrl = true;
                    options.AssumeDefaultVersionWhenUnspecified = true;
                });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    p => { p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().AllowCredentials(); });
            });

            services.AddApiVersioning(options =>
                {
                    options.ReportApiVersions = true;
                    options.ApiVersionReader = new MediaTypeApiVersionReader();
                })
                .AddSwaggerGen(
                    options =>
                    {
                        var provider = services
                            .BuildServiceProvider()
                            .GetRequiredService<IApiVersionDescriptionProvider>();

                        foreach (var description in provider.ApiVersionDescriptions)
                        {
                            options.SwaggerDoc(
                                description.GroupName,
                                CreateInfoForApiVersion(description));
                        }

                        options.OperationFilter<SwaggerDefaultValues>();
                    });

            _tasksConnection = Configuration.GetConnectionString("TasksDb");

            services.Configure<ConnectionStrings>(Configuration.GetSection(nameof(ConnectionStrings)));
            services.AddScoped<ITasksService, TasksService>();
            services.AddLogging(loggingBuilder => loggingBuilder.AddSerilog(dispose: true));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IApiVersionDescriptionProvider provider, ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection()
                .UseCors("AllowAll")
                .UseSignalR(route => { route.MapHub<NotificationsHub>("/hubs/notifications"); })
                .UseMvcWithDefaultRoute();

            app.UseSwagger();
            app.UseSwaggerUI(
                options =>
                {
                    foreach (var description in provider.ApiVersionDescriptions)
                    {
                        options.SwaggerEndpoint(
                            $"/swagger/{description.GroupName}/swagger.json",
                            description.GroupName.ToUpperInvariant());
                    }
                });
            
            var logger = loggerFactory.CreateLogger("RequestInfoLogger");

            logger.LogInformation($"TasksDb connection string is: {_tasksConnection}");
            logger.LogInformation("All services configured");
        }

        private static Info CreateInfoForApiVersion(ApiVersionDescription description)
        {
            var info = new Info
            {
                Title = $"API {description.ApiVersion}",
                Version = description.ApiVersion.ToString(),
                Description = "API version",
                Contact = new Contact() { Name = "D. D.", Email = "ddydeveloper@gmail.com" },
                TermsOfService = "Shareware",
                License = new License() { Name = "MIT", Url = "https://opensource.org/licenses/MIT" }
            };

            if (description.IsDeprecated)
            {
                info.Description += " This API version has been deprecated.";
            }

            return info;
        }

    }
}
