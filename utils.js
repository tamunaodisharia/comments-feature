import data from "./data.json" assert { type: "json" };

export const currentUserAvatar = data.currentUser.image.png;
export const currentUsername = data.currentUser.username;
export const currentUserAvatarWebp = data.currentUser.image.webp;

export function setClass(item, className) {
  item.classList.add(className);
}
