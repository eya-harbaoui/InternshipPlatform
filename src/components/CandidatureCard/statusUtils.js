// statusUtils.js

export function getStatusTag(status) {
  let tagColor, tagText;
  switch (status) {
    case "en cours":
      tagColor = "blue";
      tagText = "en cours";
      break;
    case "entretien technique programmé":
      tagColor = "purple";
      tagText = "entretien technique programmé";
      break;
    case "entretien RH programmé":
      tagColor = "purple";
      tagText = "entretien RH programmé";
      break;
    case "entretien technique confirmé":
      tagColor = "green";
      tagText = "entretien technique confirmé";
      break;
    case "entretien RH confirmé":
      tagColor = "green";
      tagText = "entretien RH confirmé";
      break;
    case "refusé":
      tagColor = "red";
      tagText = "refusé";
      break;
    case "accepté":
      tagColor = "green";
      tagText = "accepté";
      break;
    default:
      tagColor = "default";
      tagText = "Statut inconnu";
  }
  return { tagColor, tagText };
}
