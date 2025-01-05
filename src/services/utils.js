export function shortenSchema(schema, modelname, arrProps) {
  return arrProps.reduce(
    function (obj, property) {
      if (schema.properties[property])
        obj.properties[property] = schema.properties[property];
      return obj;
    },
    {
      title: modelname,
      properties: arrProps.includes("id")
        ? { id: { ...schema.properties._id, description: "Id der Entity" } }
        : {},
    }
  );
}
