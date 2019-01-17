function closestNext(counts: number[], goal: number): number {
  return counts.reduce((prev, curr) =>
    Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
  );
}

export { closestNext };
