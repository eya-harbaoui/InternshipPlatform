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
    title: "Gestion des domaines",
    url: "/Domaines",
    cName: "nav-links",
  },
  {
    title: "Gestion des compétences",
    url: "/Compétences",
    cName: "nav-links",
  },
];
