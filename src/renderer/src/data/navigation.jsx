import {
  DiscordIcon,
  HomeIcon,
  InstagramIcon,
  TiktokIcon
} from "../components/icons";

export default [
  {
    label: "homepage",
    children: <HomeIcon />
  },
  {
    label: "discord",
    href: "discord://app/invite/pokevicio",
    children: <DiscordIcon />
  },
  {
    label: "tiktok",
    href: "/",
    children: <TiktokIcon />
  },
  {
    label: "instagram",
    href: "/",
    children: <InstagramIcon />
  }
];
