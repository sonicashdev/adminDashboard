// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { MoneyRecive , Ticket2 ,Ticket , Fatrows, PresentionChart , UserRemove , Profile2User , Send2 , NoteRemove , Forbidden2 , Firstline , MessageAdd1 , Notepad2 , Cards} from 'iconsax-react';

// icons
const icons = {
  users: Profile2User,
  NoteRemove:NoteRemove,
  emails:Send2,
  Forbidden2:Forbidden2,
  statistics: Firstline,
  addPlan:Notepad2,
  createPlan:MessageAdd1,
  Cards:Cards,
  data: Fatrows,
  chart: PresentionChart,
  banned:UserRemove,
  MoneyRecive,
  Ticket2,
  Ticket
};

// ==============================|| MENU ITEMS  ||============================== //

const Dashboard = {
  id: 'group-widget',
  title: "Dashboard",
  type: 'group',
  children: [
    {
      id: 'Dashboard',
      title: "Dashboard",
      type: 'item',
      url: '/dashboard/default',
      icon: icons.statistics
    },
    {
      id: 'data',
      title: "Users",
      type: 'collapse',
      icon: icons.users,
      children:[
        {
          id: 'all-users',
          title: "All Users",
          type: 'item',
          url: '/users/all-users',
          icon: icons.users
        },
        {
          id: 'banned-users',
          title: "Banned Users",
          type: 'item',
          url: '/users/banned-users',
          icon: icons.banned
        },
        {
          id: 'email-unverified',
          title: "Email Unverified",
          type: 'item',
          url: '/users/unverified-users',
          icon: icons.Forbidden2
        },
        {
          id: 'kyc-unverified',
          title: "KYC Unverified",
          type: 'item',
          url: '/users/kyc-unverified',
          icon: icons.NoteRemove
        },
        {
          id: 'send-notifications',
          title: "Send Notifications",
          type: 'item',
          url: '/users/send-notifications-to-all',
          icon: icons.emails
        },
        {
          id: 'suspicios-logins',
          title: "Suspicious Logins",
          type: 'item',
          url: '/users/suspecious-logins',
          icon: icons.emails
        },
      ]
    },
    {
      id: 'plan',
      title: "Plans",
      type: 'collapse',
      icon: icons.Cards,
      children:[
        {
          id: 'all-plans',
          title: "All Plans",
          type: 'item',
          url: '/plans/all-plans',
          icon: icons.addPlan
        },
        {
          id: 'create-plan',
          title: "Create Plan",
          type: 'item',
          url: '/plans/create-plan',
          icon: icons.createPlan
        },
        {
          id: 'plan-requests',
          title: "Plans Requests",
          type: 'item',
          url: '/plans/plans-requests',
          icon: icons.createPlan
        },
      ],
    },
    {
      id: 'tickets',
      title: 'Tickets',
      type: 'item',
      icon:icons.Ticket2,
      url:'/tickets/all-tickets'
    },
    {
      id: 'withdrawl-requests',
      title: "Withdrawls Requests",
      type: 'item',
      url: '/withdrawl-requests',
      icon: icons.MoneyRecive
    },
  ]
};

export default Dashboard;
