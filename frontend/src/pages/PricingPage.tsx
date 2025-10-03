import { Check, Zap, Crown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const PricingPage = () => {
  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started and exploring what\'s possible',
      icon: Sparkles,
      features: [
        '10 website generations per month',
        'Basic templates',
        'Export to HTML/CSS',
        'Community support',
        'Basic customization',
        '24/7 uptime'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline',
      popular: false
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      description: 'For professionals who need more power and flexibility',
      icon: Zap,
      features: [
        'Unlimited website generations',
        'Premium templates',
        'Export to React/Vue/Angular',
        'Priority support',
        'Advanced customization',
        'Custom domains',
        'SEO optimization',
        'Analytics integration'
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'primary',
      popular: true,
      badge: 'Most Popular'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For teams and organizations with advanced requirements',
      icon: Crown,
      features: [
        'Everything in Pro',
        'White-label solution',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Custom training',
        'On-premise deployment'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden text-white bg-black">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-gray-900 to-black"></div>
      </div>

      <Header />

      <main className="relative z-10 px-4 pt-32 pb-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-transparent md:text-6xl lg:text-7xl bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text">
            Simple, transparent pricing
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-400 md:text-xl">
            Choose the perfect plan for your needs. Start free and scale as you grow.
          </p>
          
          {/* Free for now banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-green-300 rounded-full bg-green-900/30 border border-green-500/30">
            <Sparkles className="w-4 h-4" />
            Currently free for all users during beta
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative p-8 transition-all duration-300 border rounded-2xl backdrop-blur-sm group hover:-translate-y-2 ${
                  plan.popular
                    ? 'border-teal-500/50 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent'
                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-2 text-xs font-medium text-white rounded-full bg-gradient-to-r from-teal-500 to-cyan-600">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${
                    plan.popular ? 'bg-teal-600' : 'bg-gray-800'
                  }`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.price !== 'Custom' && (
                      <span className="text-gray-400">/{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{plan.description}</p>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.name === 'Free' || plan.name === 'Pro' ? '/builder' : '#'}
                  className={`block w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 text-center ${
                    plan.buttonVariant === 'primary'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700 hover:shadow-lg hover:shadow-teal-500/30'
                      : 'border border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center text-white md:text-4xl">
            Frequently Asked Questions
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold text-white">How does the free plan work?</h3>
              <p className="text-sm text-gray-400">
                During our beta period, all features are completely free. Once we launch, the free plan will include 10 website generations per month with basic templates and community support.
              </p>
            </div>

            <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold text-white">Can I upgrade or downgrade anytime?</h3>
              <p className="text-sm text-gray-400">
                Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.
              </p>
            </div>

            <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold text-white">What payment methods do you accept?</h3>
              <p className="text-sm text-gray-400">
                We accept all major credit cards, PayPal, and for Enterprise customers, we also support invoicing and wire transfers.
              </p>
            </div>

            <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold text-white">Is there a free trial for paid plans?</h3>
              <p className="text-sm text-gray-400">
                Yes, we offer a 14-day free trial for the Pro plan. No credit card required during the trial period.
              </p>
            </div>

            <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold text-white">Do you offer refunds?</h3>
              <p className="text-sm text-gray-400">
                We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll provide a full refund.
              </p>
            </div>

            <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold text-white">How does Enterprise pricing work?</h3>
              <p className="text-sm text-gray-400">
                Enterprise pricing is customized based on your specific needs, team size, and usage requirements. Contact our sales team for a personalized quote.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;