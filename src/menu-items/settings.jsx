// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Story, Fatrows, PresentionChart , Setting2 , NoteFavorite , Notepad2 } from 'iconsax-react';

// icons
const icons = {
  Settings: Setting2,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart,
  NoteFavorite,
  Notepad2
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const settings = {
  id: 'settings',
  title: 'Settings',
  icon: icons.Settings,
  type: 'group',
  children: [
    {
      id: 'General Settings',
      title: 'General Settings',
      type: 'item',
      url: '/settings/general-settings',
      icon: icons.Settings
    },
    {
      id: 'Email Settings',
      title: 'Email Settings',
      type: 'item',
      url: '/settings/email-settings',
      icon: icons.data
    },
    {
      id: 'notification-settings',
      title: 'Notification Settings',
      type: 'item',
      url: '/settings/notification-settings',
      icon: icons.chart
    },
    {
      id: 'upload-auth-image',
      title: 'Upload Auth Image',
      type: 'item',
      url: '/settings/upload',
      icon: icons.chart
    },
    {
      id: 'banner',
      title: 'Banner Data',
      type: 'collapse',
      icon: icons.chart,
      children:[
        {
          id: 'edit-banner',
          title: 'Edit Banner',
          type: 'item',
          url: '/settings/banner-data/edit-banner',
          icon: icons.Notepad2
        },
        {
          id: 'createbanner',
          title: 'Create Banner',
          type: 'item',
          url: '/settings/banner-data/add-banner',
          icon: icons.NoteFavorite
        },
      ]
    },
    {
      id: 'polls',
      title: 'Polls',
      type: 'collapse',
      icon: icons.chart,
      children:[
        {
          id: 'all-polls',
          title: 'All Polls',
          type: 'item',
          url: '/settings/polls-settings/all-polls',
          icon: icons.Notepad2
        },
        {
          id: 'create-polls',
          title: 'Create Polls',
          type: 'item',
          url: '/settings/polls-settings/create-poll',
          icon: icons.NoteFavorite
        },
      ]
    }
  ]
};

export default settings;
