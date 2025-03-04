import PropTypes from 'prop-types';
import AccountProfile from 'views/apps/AccountProfile';

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default function Page({ params }) {
  const { tab } = params;

  return <AccountProfile tab={tab} />;
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const response = ['basic', 'personal','password', 'role'];

  return response.map((tab) => ({
    tab: tab
  }));
}

Page.propTypes = { params: PropTypes.object };
