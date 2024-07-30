export const intoText = (data) => {
  if (data.operation === "add" || data.operation === "archive")
    return `${data.user} ${data.action} ${
      data.item
        ? data.item.name
        : data.itemBeforeChange
        ? data.itemBeforeChange.name
        : data.itemAfterChange.name
    }`;
  if (data.itemAfterChange && data.itemBeforeChange) {
    const { itemAfterChange, itemBeforeChange } = data;
    const f = new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "USD",
    });
    let text = `${data.user} has changed `;

    if (itemAfterChange.condition !== itemBeforeChange.condition)
      text += `the condition from ${itemBeforeChange.condition} to ${itemAfterChange.condition}, `;

    if (itemAfterChange.cost !== itemBeforeChange.cost)
      text += `the cost from ${f.format(itemBeforeChange.cost)} to ${f.format(
        itemAfterChange.cost
      )}, `;

    if (itemBeforeChange.current_worth !== itemAfterChange.current_worth)
      text += `the current worth from ${f.format(
        itemBeforeChange.current_worth
      )} to ${f.format(itemAfterChange.current_worth)}, `;

    if (itemBeforeChange.quantity !== itemAfterChange.quantity)
      text += `the quantity from ${itemBeforeChange.quantity} to ${itemAfterChange.quantity}, `;

    if (itemBeforeChange.name !== itemAfterChange.name)
      text += `the name from ${itemBeforeChange.name} to ${itemAfterChange.name}`;

    if (itemBeforeChange.category !== itemAfterChange.category)
      text += `the category, `;
    if (itemBeforeChange.sub_category !== itemAfterChange.sub_category)
      text += `the sub category`;

    return text;
  }
};
