import getUserIdFromLocalStorage from "../../UserAuth.js";

export const NavbarLinks = () => {
  const { role, userId } = getUserIdFromLocalStorage() || {};
  const links = [{ title: "Offres", url: "/Offres", cName: "nav-links" }];

  if (userId && role === "Student") {
    links.push(
      {
        title: "Mon Profil",
        url: `/userDetails/${userId}`,
        cName: "nav-links",
      },
      {
        title: "Mes candidatures",
        url: `/Mes_candidatures/${userId}`,
        cName: "nav-links",
      }
    );
  }

  return links;
};
