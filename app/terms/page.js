import LegalDoc from '../../components/LegalDoc';
import { TERMS, LAST_UPDATED } from '../../components/legal';

export const metadata = {
  title: 'Terms of Service',
  description:
    'The terms for using ruleofthirds.nyc and buying from the Rule of Thirds shop, including shipping, returns and preorders.',
  alternates: { canonical: '/terms' },
};

export default function Terms() {
  return <LegalDoc eyebrow="Policies" title="Terms of Service" updated={LAST_UPDATED} body={TERMS} />;
}
