// index.js
import { after } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts";

export default {
  onLoad() {
    const patches = [];
    
    // 1. Patch Avatars
    const Avatar = findByProps("Avatar").Avatar;
    patches.push(after("default", Avatar, (_, component) => {
      const uri = component.props.src?.replace(/\?size=\d+/, "?size=4096");
      if (!uri) return component;
      
      return React.createElement(
        findByProps("TouchableOpacity").TouchableOpacity,
        {
          onPress: () => showToast("Opening avatar", { source: { uri } }),
          activeOpacity: 0.8
        },
        component
      );
    }));

    // 2. Patch Banners
    const ProfileCard = findByProps("ProfileCard").ProfileCard;
    patches.push(after("default", ProfileCard, (_, component) => {
      const banner = component.props.bannerSource?.uri?.replace(/\?width=\d+/, "?width=1600");
      if (!banner) return component;
      
      return {
        ...component,
        props: {
          ...component.props,
          children: [
            React.createElement(
              findByProps("TouchableOpacity").TouchableOpacity,
              {
                onPress: () => showToast("Opening banner", { source: { uri: banner } }),
                activeOpacity: 0.8
              },
              component.props.children[0]
            ),
            ...component.props.children.slice(1)
          ]
        }
      };
    }));

    return () => patches.forEach(p => p());
  }
};
