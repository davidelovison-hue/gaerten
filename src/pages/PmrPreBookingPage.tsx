import { useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckoutSummaryCard } from '../components/CheckoutSummaryCard';
import {
  checkoutHasPmrProof,
  checkoutRequiresPmrProof,
  type EventCheckoutState,
  type PmrPreBookingAnswers,
} from '../lib/checkoutState';
import { persistCheckoutBasket, resolveEventCheckoutState } from '../lib/checkoutFlowStorage';
import { checkoutPath, connectPath, guestCheckoutPath, planPath } from '../lib/routes';
import '../CheckoutPage.css';
import '../GuestCheckoutPage.css';
import './PmrPreBookingPage.css';

const CHOICE = 'Your choice';

const GENDER_OPTIONS = ['Man', 'Woman', 'Non-binary', 'Prefer not to say'];
const COUNTRY_OPTIONS = ['Spain', 'France', 'Portugal', 'United Kingdom', 'United States', 'Mexico', 'Other'];
const SITUATION_OPTIONS = [
  'Wheelchair user',
  'Reduced mobility (without a wheelchair)',
  'Sensory disability',
  'Invisible disability',
  'Injury / temporary limitation',
  'Other',
];
const MOBILITY_OPTIONS = [
  'Manual wheelchair',
  'Electric wheelchair',
  'Cane / crutches',
  'No mobility aid',
  'Other',
];
const YES_NO_OPTIONS = ['Yes', 'No'];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];
const YEARS = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));

const emptyAnswers = (): PmrPreBookingAnswers => ({
  gender: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
    phoneCountryCode: '+34',
  phoneNational: '',
  country: '',
  city: '',
  postalCode: '',
  address: '',
  situation: '',
  mobilityAid: '',
  assistanceDog: '',
  specificNeeds: '',
  withAssociation: '',
});

export function PmrPreBookingPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const data = useMemo(
    () => (eventId ? resolveEventCheckoutState(eventId, location.state) : null),
    [eventId, location.state],
  );

  const [answers, setAnswers] = useState<PmrPreBookingAnswers>(
    () => data?.pmrAnswers ?? emptyAnswers(),
  );
  const [fileName, setFileName] = useState(data?.pmrProofFileName ?? '');

  if (!eventId || !data) {
    return <Navigate to={eventId ? planPath('abonos') : '/'} replace />;
  }

  if (!checkoutRequiresPmrProof(data)) {
    const next =
      data.guestCheckout && !data.guest
        ? guestCheckoutPath(eventId)
        : checkoutPath(eventId);
    return <Navigate to={next} replace state={data} />;
  }

  if (checkoutHasPmrProof(data)) {
    const next =
      data.guestCheckout && !data.guest
        ? guestCheckoutPath(eventId)
        : checkoutPath(eventId);
    return <Navigate to={next} replace state={data} />;
  }

  const summaryPayload = {
    eventTitle: data.eventTitle,
    eventImage: data.eventImage,
    venue: data.venue,
    dateLine: data.dateLine,
    lines: data.lines,
    subtotal: data.subtotal,
    serviceFee: data.serviceFee,
    total: data.total,
  };

  const setField = <K extends keyof PmrPreBookingAnswers>(key: K, value: PmrPreBookingAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const onContinue = (e: FormEvent) => {
    e.preventDefault();

    const next: EventCheckoutState = {
      ...data,
      pmrProofFileName: fileName.trim() || 'skipped',
      pmrAnswers: answers,
    };
    persistCheckoutBasket(eventId, next);

    if (next.guestCheckout && !next.guest) {
      navigate(guestCheckoutPath(eventId), { state: next });
      return;
    }
    navigate(checkoutPath(eventId), { state: next });
  };

  return (
    <div className="checkoutPage guestCheckoutPage pmrPreBookingPage">
      <div className="checkoutPage__shell">
        <Link className="checkoutPage__back" to={connectPath(eventId)} state={data}>
          <span className="checkoutPage__backArrow" aria-hidden>
            ←
          </span>
          Confirm and pay
        </Link>

        <div className="checkoutGrid">
          <section className="checkoutGrid__payment guestCheckoutPanel pmrPreBookingPanel">
            <h1 className="pmrPreBookingPanel__heading">Booking details</h1>

            <form className="pmrPreBookingForm" onSubmit={onContinue} noValidate>
              <div className="pmrPreBookingForm__fields">
                <div className="pmrPreBookingField">
                  <label className="pmrPreBookingField__label" htmlFor="pmr-gender">
                    Gender <span className="pmrPreBookingField__required">*</span>
                  </label>
                  <select
                    id="pmr-gender"
                    className="pmrPreBookingField__control"
                    value={answers.gender}
                    onChange={(e) => setField('gender', e.target.value)}
                  >
                    <option value="">{CHOICE}</option>
                    {GENDER_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <fieldset className="pmrPreBookingField pmrPreBookingField--dob">
                  <legend className="pmrPreBookingField__label">
                    Date of birth <span className="pmrPreBookingField__required">*</span>
                  </legend>
                  <div className="pmrPreBookingDob">
                    <select
                      aria-label="Day"
                      className="pmrPreBookingField__control"
                      value={answers.birthDay}
                      onChange={(e) => setField('birthDay', e.target.value)}
                    >
                      <option value="">Day</option>
                      {DAYS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Month"
                      className="pmrPreBookingField__control"
                      value={answers.birthMonth}
                      onChange={(e) => setField('birthMonth', e.target.value)}
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Year"
                      className="pmrPreBookingField__control"
                      value={answers.birthYear}
                      onChange={(e) => setField('birthYear', e.target.value)}
                    >
                      <option value="">Year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>

                <div className="pmrPreBookingField">
                  <label className="pmrPreBookingField__label" htmlFor="pmr-phone">
                    Mobile phone <span className="pmrPreBookingField__required">*</span>
                  </label>
                  <div className="pmrPreBookingPhone">
                    <select
                      aria-label="Country code"
                      className="pmrPreBookingField__control pmrPreBookingPhone__code"
                      value={answers.phoneCountryCode}
                      onChange={(e) => setField('phoneCountryCode', e.target.value)}
                    >
                      <option value="+34">🇪🇸 +34</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+351">🇵🇹 +351</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+1">🇺🇸 +1</option>
                    </select>
                    <input
                      id="pmr-phone"
                      type="tel"
                      className="pmrPreBookingField__control"
                      value={answers.phoneNational}
                      onChange={(e) => setField('phoneNational', e.target.value)}
                      placeholder="Number"
                      autoComplete="tel-national"
                    />
                  </div>
                </div>

                <div className="pmrPreBookingField">
                  <label className="pmrPreBookingField__label" htmlFor="pmr-country">
                    Country <span className="pmrPreBookingField__required">*</span>
                  </label>
                  <select
                    id="pmr-country"
                    className="pmrPreBookingField__control"
                    value={answers.country}
                    onChange={(e) => setField('country', e.target.value)}
                  >
                    <option value="">{CHOICE}</option>
                    {COUNTRY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pmrPreBookingField">
                  <label className="pmrPreBookingField__label" htmlFor="pmr-city">
                    City <span className="pmrPreBookingField__required">*</span>
                  </label>
                  <input
                    id="pmr-city"
                    type="text"
                    className="pmrPreBookingField__control"
                    value={answers.city}
                    onChange={(e) => setField('city', e.target.value)}
                    autoComplete="address-level2"
                  />
                </div>

                <div className="pmrPreBookingField">
                  <label className="pmrPreBookingField__label" htmlFor="pmr-postal">
                    Postal code <span className="pmrPreBookingField__required">*</span>
                  </label>
                  <input
                    id="pmr-postal"
                    type="text"
                    className="pmrPreBookingField__control"
                    value={answers.postalCode}
                    onChange={(e) => setField('postalCode', e.target.value)}
                    autoComplete="postal-code"
                  />
                </div>

                <div className="pmrPreBookingField">
                  <label className="pmrPreBookingField__label" htmlFor="pmr-address">
                    Address <span className="pmrPreBookingField__required">*</span>
                  </label>
                  <input
                    id="pmr-address"
                    type="text"
                    className="pmrPreBookingField__control"
                    value={answers.address}
                    onChange={(e) => setField('address', e.target.value)}
                    autoComplete="street-address"
                  />
                </div>

                <div className="pmrPreBookingField">
                  <label className="pmrPreBookingField__label" htmlFor="pmr-situation">
                    What is your situation?{' '}
                    <span className="pmrPreBookingField__required">*</span>
                  </label>
                  <select
                    id="pmr-situation"
                    className="pmrPreBookingField__control"
                    value={answers.situation}
                    onChange={(e) => setField('situation', e.target.value)}
                  >
                    <option value="">{CHOICE}</option>
                    {SITUATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pmrPreBookingField">
                  <label className="pmrPreBookingField__label" htmlFor="pmr-mobility">
                    For getting around, you mainly use...{' '}
                    <span className="pmrPreBookingField__required">*</span>
                  </label>
                  <select
                    id="pmr-mobility"
                    className="pmrPreBookingField__control"
                    value={answers.mobilityAid}
                    onChange={(e) => setField('mobilityAid', e.target.value)}
                  >
                    <option value="">{CHOICE}</option>
                    {MOBILITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pmrPreBookingField">
                  <label className="pmrPreBookingField__label" htmlFor="pmr-dog">
                    Are you travelling with an assistance dog?{' '}
                    <span className="pmrPreBookingField__required">*</span>
                  </label>
                  <select
                    id="pmr-dog"
                    className="pmrPreBookingField__control"
                    value={answers.assistanceDog}
                    onChange={(e) => setField('assistanceDog', e.target.value)}
                  >
                    <option value="">{CHOICE}</option>
                    {YES_NO_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pmrPreBookingField">
                  <label className="pmrPreBookingField__label" htmlFor="pmr-needs">
                    Would you like to add details about your situation, condition, or specific
                    needs (wheelchair space, companion, etc.)?
                  </label>
                  <textarea
                    id="pmr-needs"
                    className="pmrPreBookingField__control pmrPreBookingField__textarea"
                    rows={4}
                    value={answers.specificNeeds}
                    onChange={(e) => setField('specificNeeds', e.target.value)}
                  />
                </div>

                <div className="pmrPreBookingField">
                  <label className="pmrPreBookingField__label" htmlFor="pmr-association">
                    Will you be coming with an association or specialized center?{' '}
                    <span className="pmrPreBookingField__required">*</span>
                  </label>
                  <select
                    id="pmr-association"
                    className="pmrPreBookingField__control"
                    value={answers.withAssociation}
                    onChange={(e) => setField('withAssociation', e.target.value)}
                  >
                    <option value="">{CHOICE}</option>
                    {YES_NO_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pmrPreBookingField">
                  <label className="pmrPreBookingField__label" htmlFor={fileInputId}>
                    Please upload your supporting document (disability card, medical
                    certificate, etc.) <span className="pmrPreBookingField__required">*</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    id={fileInputId}
                    type="file"
                    className="pmrPreBookingField__fileInput"
                    accept="image/*,.pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
                  />
                  <button
                    type="button"
                    className={`pmrPreBookingField__dropzone${fileName ? ' pmrPreBookingField__dropzone--filled' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {fileName ? fileName : 'Choose your file'}
                  </button>
                </div>
              </div>

              <div className="pmrPreBookingForm__cta">
                <button
                  type="submit"
                  className="pmrPreBookingContinue"
                >
                  Continue
                </button>
              </div>
            </form>
          </section>

          <aside className="checkoutGrid__summary" aria-label="Order summary">
            <div className="pmrPreBookingSummarySticky">
              <CheckoutSummaryCard data={summaryPayload} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
