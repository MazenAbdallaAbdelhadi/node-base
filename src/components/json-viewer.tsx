export const JsonViewer = ({ obj }: { obj: unknown }) => {
  return <pre>{JSON.stringify(obj, null, 2)}</pre>;
};
