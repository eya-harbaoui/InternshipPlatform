export const OfferStatusList = [
  "en cours de validation",
  "publié",
  "brouillon",
  "archivé",
];

export function getStatusTag(status) {
  let tagColor, tagText;
  switch (status) {
    case "en cours de validation":
      tagColor = "blue";
      tagText = "en cours de validation";
      break;
    case "publié":
      tagColor = "green";
      tagText = "publié";
      break;
    case "brouillon":
      tagColor = "red";
      tagText = "brouillon";
      break;
    case "archivé":
      tagColor = "purple";
      tagText = "Archivé";
      break;
    default:
      tagColor = "default";
      tagText = "Statut inconnu";
  }
  return { tagColor, tagText };
}
