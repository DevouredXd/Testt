import { before, after } from "@vendetta/patcher";
import { findByName, findByProps } from "@vendetta/metro";
import { React, ReactNative } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts";
import type { Patcher } from "@vendetta/patcher";

const { TouchableOpacity } = ReactNative;

// Type definitions for Discord components
interface AvatarProps {
    src: string;
    size: number;
    [key: string]: any;
}

interface ProfileCardProps {
    bannerSource?: { uri: string };
    children: React.ReactNode[];
    [key: string]: any;
}

export default {
    onLoad(): () => void {
        const patches: Patcher[] = [];

        // 1. Make avatars clickable
        const Avatar = findByName("Avatar") ?? findByProps("Avatar").Avatar;
        patches.push(
            after("default", Avatar, (args: [AvatarProps], component: React.ReactElement) => {
                const [props] = args;
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            const highResUrl = props.src.replace(/(size)=\d+/, "$1=4096");
                            showToast("Opening full avatar", { 
                                source: { uri: highResUrl } 
                            });
                        }}
                    >
                        {component}
                    </TouchableOpacity>
                );
            })
        );

        // 2. Make banners clickable
        const ProfileCard = findByName("ProfileCard") ?? findByProps("ProfileCard").ProfileCard;
        patches.push(
            after("default", ProfileCard, (args: [ProfileCardProps], component: React.ReactElement) => {
                const [props] = args;
                if (!props.bannerSource) return component;

                return React.cloneElement(component, {
                    children: [
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                const highResUrl = props.bannerSource!.uri.replace(/(width)=\d+/, "$1=1600");
                                showToast("Opening full banner", { 
                                    source: { uri: highResUrl } 
                                });
                            }}
                        >
                            {props.children[0]}
                        </TouchableOpacity>,
                        ...props.children.slice(1)
                    ]
                });
            })
        );

        // 3. Make guild icons clickable
        const GuildIcon = findByProps("GuildIcon")?.GuildIcon;
        if (GuildIcon) {
            patches.push(
                after("default", GuildIcon, (args: [{ icon: string, size: number }], component: React.ReactElement) => {
                    const [props] = args;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                const highResUrl = `https://cdn.discordapp.com/icons/${props.guildId}/${props.icon}.png?size=4096`;
                                showToast("Opening full server icon", { 
                                    source: { uri: highResUrl } 
                                });
                            }}
                        >
                            {component}
                        </TouchableOpacity>
                    );
                })
            );
        }

        return () => patches.forEach(p => p.unpatch());
    }
};
