import { Phone, MessageCircle, MapPin, Instagram, Clock, Mail } from 'lucide-react';

const CONTACT_ACTIONS = [
  {
    id: 'footer-call',
    icon: Phone,
    label: 'Call',
    href: 'tel:9876543210',
    hoverClass: 'hover:border-primary hover:text-primary',
  },
  {
    id: 'footer-whatsapp',
    icon: MessageCircle,
    label: 'WhatsApp',
    href: 'https://wa.me/9876543210?text=Hey%20I%20am%20interested%20in%20your%20fitness%20center.%20please%20text%20back',
    hoverClass: 'hover:border-green-500 hover:text-green-400',
  },
  {
    id: 'footer-instagram',
    icon: Instagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/cristiano',
    hoverClass: 'hover:border-pink-500 hover:text-pink-400',
  },
  {
    id: 'footer-directions',
    icon: MapPin,
    label: 'Directions',
    href: 'https://www.google.com/maps/search/?api=1&query=Amravati',
    hoverClass: 'hover:border-blue-500 hover:text-blue-400',
  },
] as const;

export function Footer() {
  return (
    <footer id="contact" className="bg-surface-elevated border-t border-outline/20">
      {/* Command Center */}
      <div className="section-container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Styled Dark Map */}
          <div className="relative w-full h-[400px] lg:h-auto lg:min-h-[500px] bg-black border border-outline overflow-hidden group">
            {/* Gold border hover effect */}
            <div className="absolute inset-0 border border-primary/20 group-hover:border-primary/50 transition-colors duration-500 pointer-events-none z-10" />

            <iframe
              title="Vigor Fitness Club Location Map"
              src="https://maps.google.com/maps?q=Amravati,%20Maharashtra&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              className="absolute inset-0 border-0"
              style={{
                filter: 'invert(90%) hue-rotate(180deg) grayscale(0.8) contrast(1.2) brightness(0.9)',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Bottom gradient for seamless blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Right: Contact Info */}
          <div className="flex flex-col justify-center">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl uppercase mb-2 text-on-surface">
              Fitness <span className="text-primary">Club</span>
            </h2>
            <div className="h-[2px] w-16 bg-primary mb-10" />

            {/* Address */}
            <div className="flex items-start gap-4 mb-8">
              <MapPin size={20} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-on-surface text-sm font-headline uppercase tracking-widest font-bold mb-1">
                  Location
                </p>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">
                  Amravati, Maharashtra
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4 mb-8">
              <Clock size={20} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-on-surface text-sm font-headline uppercase tracking-widest font-bold mb-1">
                  Hours
                </p>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Mon – Sat: 6:00 AM – 10:00 AM | 6:00 PM – 10:00 PM
                  <br />
                  Women Only: 4:00 PM – 6:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 mb-12">
              <Mail size={20} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-on-surface text-sm font-headline uppercase tracking-widest font-bold mb-1">
                  Email
                </p>
                <a
                  href="mailto:info@fitnessclub.com"
                  className="text-on-surface-variant text-sm hover:text-primary transition-colors duration-300"
                >
                  info@fitnessclub.com
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CONTACT_ACTIONS.map((action) => {
                const IconComp = action.icon;
                return (
                  <a
                    key={action.id}
                    id={action.id}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center gap-2.5 py-4 px-3 border border-outline/30 bg-surface-high transition-all duration-300 ease-vault ${action.hoverClass}`}
                  >
                    <IconComp size={20} />
                    <span className="font-headline text-[10px] uppercase tracking-widest">
                      {action.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-outline/10">
        <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-on-surface-variant text-xs">
            &copy; {new Date().getFullYear()} Fitness Club. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-on-surface-variant text-xs hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-on-surface-variant text-xs hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-on-surface-variant text-xs hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
