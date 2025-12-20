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
	avatarSrc: "https://www.gravatar.com/avatar/084796c04c555da9002216a4852c2f3c",
	name: "@gamoutatsumi",
	bio: "Vimmer",
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
