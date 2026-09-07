/**
 * Shape of the editable site copy stored in the `SiteContent` singleton row.
 * The frontend consumes this verbatim, so keep the field names in sync with
 * `frontend/src/api/content.ts`.
 */
export type SiteContentData = {
  hero: {
    line1: string;
    line2: string;
    line3: string;
    subtext: string;
    cta: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    color: string;
  };
  openingHours: {
    title: string;
    rows: { label: string; from: string; to: string; closed: boolean }[];
  };
  restaurant: {
    address: string;
    mapEmbedUrl: string;
    phone: string;
    email: string;
    hoursLabel: string;
    hours: string;
  };
};

export const DEFAULT_SITE_CONTENT: SiteContentData = {
  hero: {
    line1: 'EAT',
    line2: 'ENJOY',
    line3: 'REPEAT',
    subtext:
      'Smashed fresh. Served loud. Nakhipot’s favourite smash burgers since day one.',
    cta: 'Order Now',
  },
  announcement: {
    enabled: true,
    text: 'Happy Hours: flat 10% off on all drinks till 6 PM',
    color: '#E8452C',
  },
  openingHours: {
    title: 'Opening Hours',
    rows: [
      { label: 'Mon–Thu', from: '11:30 AM', to: '10:00 PM', closed: false },
      { label: 'Fri–Sun', from: '11:30 AM', to: '11:00 PM', closed: false },
    ],
  },
  restaurant: {
    address: 'Nakhipot, Lalitpur, Nepal',
    mapEmbedUrl:
      'https://maps.google.com/maps?q=Nakhipot%20Lalitpur&ll=27.6551,85.3157&z=16&output=embed',
    phone: '+977 9800000000',
    email: 'hello@bitebox.com.np',
    hoursLabel: "We're Open",
    hours: 'Mon–Sun: 11:30 AM – 10:00 PM',
  },
};
