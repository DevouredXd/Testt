import { after } from "@vendetta/patcher";
import { findByName, findByProps } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts";

// Find profile components
const ProfileCard = findByName("ProfileCard") ?? findByProps("ProfileCard").ProfileCard;
const Avatar = findByName("Avatar") ?? findByProps("Avatar").Avatar;

export default {
  onLoad() {
    const patches = [];

    // Make profile pictures clickable
    patches.push(
      after("default", Avatar, (_, component) => {
        const { src, size } = component.props;
        return React.createElement(
          React.TouchableOpacity,
          {
            onPress: () => {
              const url = src.replace(/size=\d+/, "size=4096");
              showToast("Opening full avatar", { source: { uri: url } });
            },
            activeOpacity: 0.8
          },
          component
        );
      })
    );

    // Make banners clickable
    patches.push(
      after("default", ProfileCard, (_, component) => {
        const { bannerSource } = component.props;
        if (!bannerSource) return component;

        return React.cloneElement(component, {
          children: [
            React.createElement(
              React.TouchableOpacity,
              {
                onPress: () => {
                  const url = bannerSource.uri.replace(/width=\d+/, "width=1600");
                  showToast("Opening full banner", { source: { uri: url } });
                },
                activeOpacity: 0.8
              },
              component.props.children[0] // Banner component
            ),
            ...component.props.children.slice(1)
          ]
        });
      })
    );

    return () => patches.forEach(p => p());
  }
};
