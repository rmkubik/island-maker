function shouldOverrideObject({ hex, selected }) {
  // Objects can specify other objects that they can override
  let isOverridingObject = selected.validObjectOverrides?.includes(
    hex.objectType
  );

  // If the valid object override contains the special keyword "all"
  // we will set overriding to true as there are no invalid
  // targets
  isOverridingObject = selected.validObjectOverrides?.includes("all")
    ? true
    : isOverridingObject;

  // If an object has NOT valid object types, we allow these
  // to override the previous logic and set overriding to
  // false if so.
  const isNotValidObjectOverride = selected.notValidObjectOverrides?.includes(
    hex.objectType
  );

  isOverridingObject = isNotValidObjectOverride ? false : isOverridingObject;

  return isOverridingObject;
}

export default shouldOverrideObject;
