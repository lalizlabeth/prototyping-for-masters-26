const loaders = import.meta.glob("./widgets/*.js");

export const loadWidgets = async () => {
  const paths = Object.keys(loaders).sort();
  const modules = await Promise.all(paths.map((path) => loaders[path]()));
  return modules.map((module) => module.default).filter(Boolean);
};
