export const ManagerNavbarLinks = (id) => [
  {
    title: "Offres",
    url: "/Liste_des_Offres",
    cName: "nav-links",
  },
  {
    title: " Validation des Offres",
    url: `/manager_validation/${id}`,
    cName: "nav-links",
  },
  {
    title: "Mon Profil",
    url: "/Manager_details",
    cName: "nav-links",
  },

  {
    title: "Gestion des domaines",
    url: "/Domaines_et_Compétences",
    cName: "nav-links",
  },
];
