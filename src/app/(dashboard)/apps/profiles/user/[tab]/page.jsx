import PropTypes from 'prop-types';
import UserProfile from 'views/apps/UserProfile';

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default function Page({ params }) {
  const { tab } = params;

  return <UserProfile tab={tab} />;
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const response = ['personal', 'payment', 'password', 'settings'];

  return response.map((tab) => ({
    tab: tab
  }));
}

Page.propTypes = { params: PropTypes.object };
