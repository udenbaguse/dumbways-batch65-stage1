const strategyRegistry = {
  required: ({ value }) => value.trim().length > 0,
  email: ({ value, field }) => value.trim().length === 0 || field.checkValidity(),
  dateOnOrAfter: ({ value, root, options }) => {
    const compareField = root.querySelector(options.compareSelector);
    if (!compareField) return true;
    if (!value || !compareField.value) return true;
    return new Date(value) >= new Date(compareField.value);
  },
  minChecked: ({ group, options }) => {
    const min = options?.min ?? 1;
    const checkedCount = [...group].filter((input) => input.checked).length;
    return checkedCount >= min;
  },
};

function normalizeRule(rule) {
  if (typeof rule === "string") {
    return { name: rule, options: {} };
  }
  return { name: rule.name, options: rule.options ?? {} };
}

function runFieldRules(fieldConfig, root) {
  const field = root.querySelector(fieldConfig.selector);
  if (!field) return true;

  const value = field.value ?? "";
  const isValid = fieldConfig.rules.every((rule) => {
    const normalizedRule = normalizeRule(rule);
    const validator = strategyRegistry[normalizedRule.name];
    if (!validator) return true;
    return validator({
      value,
      field,
      root,
      options: normalizedRule.options,
    });
  });

  field.classList.toggle("is-valid", isValid);
  field.classList.toggle("is-invalid", !isValid);
  return isValid;
}

function runGroupRules(groupConfig, root) {
  const group = root.querySelectorAll(groupConfig.selector);
  if (!group.length) return true;

  const isValid = groupConfig.rules.every((rule) => {
    const normalizedRule = normalizeRule(rule);
    const validator = strategyRegistry[normalizedRule.name];
    if (!validator) return true;
    return validator({
      group,
      root,
      options: normalizedRule.options,
    });
  });

  if (groupConfig.feedbackSelector) {
    const feedback = root.querySelector(groupConfig.feedbackSelector);
    if (feedback) {
      feedback.classList.toggle("d-none", isValid);
    }
  }

  return isValid;
}

export function buildValidator(config) {
  const fieldConfigs = config?.fields ?? [];
  const groupConfigs = config?.groups ?? [];

  return {
    validate(root) {
      const areFieldsValid = fieldConfigs.every((fieldConfig) =>
        runFieldRules(fieldConfig, root),
      );
      const areGroupsValid = groupConfigs.every((groupConfig) =>
        runGroupRules(groupConfig, root),
      );

      return areFieldsValid && areGroupsValid;
    },
    setupRealtime(root) {
      fieldConfigs.forEach((fieldConfig) => {
        const field = root.querySelector(fieldConfig.selector);
        if (!field) return;

        const revalidate = () => runFieldRules(fieldConfig, root);
        field.addEventListener("input", revalidate);
        field.addEventListener("change", revalidate);
      });

      groupConfigs.forEach((groupConfig) => {
        const group = root.querySelectorAll(groupConfig.selector);
        if (!group.length) return;

        group.forEach((input) => {
          input.addEventListener("change", () => runGroupRules(groupConfig, root));
        });
      });
    },
  };
}
