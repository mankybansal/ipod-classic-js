import { useMemo } from 'react';

import {
  getConditionalOption,
  SelectableList,
  SelectableListOption,
} from 'components';
import { PREVIEW } from 'components/previews';
import ViewOptions, { AboutView } from 'components/views';
import {
  useMenuHideWindow,
  useMusicKit,
  useScrollHandler,
  useSettings,
  useSpotifySDK,
} from 'hooks';

const SettingsView = () => {
  useMenuHideWindow(ViewOptions.settings.id);
  const {
    isAuthorized,
    isAppleAuthorized,
    isSpotifyAuthorized,
    service,
    deviceTheme,
    deviceSide,
    setDeviceTheme,
    setDeviceSide,
  } = useSettings();
  const { signIn: signInWithApple, signOut: signOutApple } = useMusicKit();
  const { signOut: signOutSpotify, signIn: signInWithSpotify } =
    useSpotifySDK();

  const options: SelectableListOption[] = useMemo(
    () => [
      {
        type: 'View',
        label: 'About',
        viewId: ViewOptions.about.id,
        component: () => <AboutView />,
        preview: PREVIEW.SETTINGS,
      },
      /** Add an option to select between services signed into more than one. */
      ...getConditionalOption(isAuthorized, {
        type: 'ActionSheet',
        id: ViewOptions.serviceTypeActionSheet.id,
        label: 'Choose service',
        listOptions: [
          {
            type: 'Action',
            isSelected: service === 'apple',
            label: `Apple Music ${service === 'apple' ? '(Current)' : ''}`,
            onSelect: signInWithApple,
          },
          {
            type: 'Action',
            isSelected: service === 'spotify',
            label: `Spotify ${service === 'spotify' ? '(Current)' : ''}`,
            onSelect: signInWithSpotify,
          },
        ],
        preview: PREVIEW.SERVICE,
      }),
      {
        type: 'ActionSheet',
        id: ViewOptions.deviceThemeActionSheet.id,
        label: 'Device theme',
        listOptions: [
          {
            type: 'Action',
            isSelected: deviceTheme === 'silver',
            label: `Silver ${deviceTheme === 'silver' ? '(Current)' : ''}`,
            onSelect: () => setDeviceTheme('silver'),
          },
          {
            type: 'Action',
            isSelected: deviceTheme === 'black',
            label: `Black ${deviceTheme === 'black' ? '(Current)' : ''}`,
            onSelect: () => setDeviceTheme('black'),
          },
          {
            type: 'Action',
            isSelected: deviceTheme === 'u2',
            label: `U2 Edition ${deviceTheme === 'u2' ? '(Current)' : ''}`,
            onSelect: () => setDeviceTheme('u2'),
          },
        ],
        preview: PREVIEW.DEVICE,
      },
      {
        type: 'ActionSheet',
        label: 'View back case',
        id: ViewOptions.deviceSideActionSheet.id,
        listOptions: [
          {
            type: 'Action',
            isSelected: deviceSide === 'back',
            label: `Show back case ${deviceSide === 'back' ? '(Current)' : ''}`,
            onSelect: () => setDeviceSide('back'),
          },
          {
            type: 'Action',
            isSelected: deviceSide === 'front',
            label: `Hide back case ${
              deviceSide === 'front' ? '(Current)' : ''
            }`,
            onSelect: () => setDeviceSide('front'),
          },
        ],
      },
      /** Show the sign in option if not signed into any service. */
      ...getConditionalOption(!isAuthorized, {
        type: 'ActionSheet',
        id: ViewOptions.signinPopup.id,
        label: 'Sign in',
        listOptions: [
          {
            type: 'Action',
            label: 'Apple Music',
            onSelect: signInWithApple,
          },
          {
            type: 'Action',
            label: 'Spotify',
            onSelect: signInWithSpotify,
          },
        ],
        preview: PREVIEW.MUSIC,
      }),
      /** Show the signout option for any services that are authenticated. */
      ...getConditionalOption(isAuthorized, {
        type: 'ActionSheet',
        id: ViewOptions.signOutPopup.id,
        label: 'Sign out',
        listOptions: [
          ...getConditionalOption(isAppleAuthorized, {
            type: 'Action',
            label: 'Apple Music',
            onSelect: signOutApple,
          }),
          ...getConditionalOption(isSpotifyAuthorized, {
            type: 'Action',
            label: 'Spotify',
            onSelect: signOutSpotify,
          }),
        ],
        preview: PREVIEW.SERVICE,
      }),
    ],
    [
      deviceTheme,
      deviceSide,
      setDeviceTheme,
      setDeviceSide,
      isAppleAuthorized,
      isAuthorized,
      isSpotifyAuthorized,
      service,
      signInWithApple,
      signInWithSpotify,
      signOutApple,
      signOutSpotify,
    ]
  );

  const [scrollIndex] = useScrollHandler(ViewOptions.settings.id, options);

  return <SelectableList options={options} activeIndex={scrollIndex} />;
};

export default SettingsView;
