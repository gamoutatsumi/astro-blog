export interface ProfileLink {
	label: string;
	href: string;
	icon?: string;
}

export interface ProfileData {
	avatarSrc: string;
	name: string;
	bio: string;
	links: ProfileLink[];
}

export const profileData: ProfileData = {
	avatarSrc: "/avatar.jpg",
	name: "@gamoutatsumi",
	bio: "開発者・ブロガー",
	links: [
		{
			label: "X",
			href: "https://x.com/gamoutatsumi",
			icon: "i-simple-icons-x",
		},
		{
			label: "GitHub",
			href: "https://github.com/gamoutatsumi",
			icon: "i-simple-icons-github",
		},
	],
};
