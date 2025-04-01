import { after } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";

export default {
    onLoad() {
        const patches = [];
        const { TouchableOpacity } = findByProps("TouchableOpacity");
        const { showImagePreview } = findByProps("showImagePreview");

        // 1. Patch Profile Pictures
        const Avatar = findByProps("Avatar").Avatar;
        patches.push(after("default", Avatar, ([props], component) => {
            const highResAvatar = props.src?.replace(/\?size=\d+/, "?size=4096");
            if (!highResAvatar) return component;

            return React.createElement(
                TouchableOpacity,
                {
                    onPress: () => showImagePreview(highResAvatar, []),
                    activeOpacity: 0.8
                },
                component
            );
        }));

        // 2. Patch Banners
        const ProfileBanner = findByProps("ProfileBanner")?.ProfileBanner;
        if (ProfileBanner) {
            patches.push(after("default", ProfileBanner, ([props], component) => {
                const highResBanner = props.bannerSource?.uri?.replace(/\?width=\d+/, "?width=2048");
                if (!highResBanner) return component;

                return React.createElement(
                    TouchableOpacity,
                    {
                        onPress: () => showImagePreview(highResBanner, []),
                        activeOpacity: 0.8
                    },
                    component
                );
            }));
        }

        // 3. Patch User Profile Header
        const UserProfileHeader = findByProps("UserProfileHeader")?.UserProfileHeader;
        if (UserProfileHeader) {
            patches.push(after("default", UserProfileHeader, (_, component) => {
                const avatar = component.props?.user?.getAvatarURL?.();
                const banner = component.props?.bannerSource?.uri;

                return React.createElement(
                    TouchableOpacity,
                    {
                        onPress: () => {
                            if (banner) showImagePreview(banner.replace(/\?width=\d+/, "?width=2048"), []);
                            else if (avatar) showImagePreview(avatar.replace(/\?size=\d+/, "?size=4096"), []);
                        },
                        activeOpacity: 0.9
                    },
                    component
                );
            }));
        }

        return () => patches.forEach(p => p?.());
    }
};
