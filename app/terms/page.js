import LegalDoc from '../../components/LegalDoc';
import { TERMS, LAST_UPDATED } from '../../components/legal';

export const metadata = {
  title: 'Terms of Service',
};

export default function Terms() {
  return <LegalDoc eyebrow="Policies" title="Terms of Service" updated={LAST_UPDATED} body={TERMS} />;
}
