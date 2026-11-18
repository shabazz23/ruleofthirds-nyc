import LegalDoc from '../../components/LegalDoc';
import { PRIVACY, LAST_UPDATED } from '../../components/legal';

export const metadata = {
  title: 'Privacy Policy',
};

export default function Privacy() {
  return <LegalDoc eyebrow="Policies" title="Privacy Policy" updated={LAST_UPDATED} body={PRIVACY} />;
}
