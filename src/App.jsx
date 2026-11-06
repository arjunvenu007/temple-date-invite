
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  Heart,
  Sparkles,
  MapPin,
  CalendarDays,
  Clock3,
  Flower2,
  ArrowUpRight,
  Sun,
  Check
} from 'lucide-react';

import templeImage from './assets/aranmula-temple.png';
import './App.css';

const floaters = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 7) % 100}%`,
  delay: (i % 7) * 0.7,
  duration: 8 + (i % 5) * 2
}));

const MIN_DATE = '2026-11-13';

// Convert manually typed time into HH:MM AM/PM
const formatTime = (value) => {
  const cleaned = value.toUpperCase().replace(/[^0-9APM]/g, '');
  const match = cleaned.match(/^(\d{1,2})(\d{0,2})(AM|PM)?$/);

  if (!match) return value;

  const hours = parseInt(match[1], 10);
  let minutes = match[2];
  const period = match[3];

  if (hours < 1 || hours > 12) return value;

  if (minutes && parseInt(minutes, 10) > 59) return value;

  if (!minutes) minutes = '00';
  if (minutes.length === 1) minutes = `0${minutes}`;

  return `${String(hours).padStart(2, '0')}:${minutes}${
    period ? ` ${period}` : ''
  }`;
};

function App() {
  // Splash screen
  const [started, setStarted] = useState(false);

  // Invitation
  const [accepted, setAccepted] = useState(false);

  // NO button interaction
  const [noClicks, setNoClicks] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noVisible, setNoVisible] = useState(true);

  // Countdown
  const [countdown, setCountdown] = useState(30);
  const [countdownActive, setCountdownActive] = useState(false);

  // Date form
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  // Move NO button to a new position
  const dodgeNo = () => {
    if (!noVisible || noClicks < 2) return;

    setNoPosition({
      x: (Math.random() - 0.5) * 180,
      y: (Math.random() - 0.5) * 100
    });
  };

  // NO button click/tap
  const handleNoClick = () => {
    if (!noVisible) return;

    if (noClicks >= 2) {
      dodgeNo();
    }

    setNoClicks(previous => previous + 1);

    if (!countdownActive) {
      setCountdown(30);
      setCountdownActive(true);
    }
  };

  // YES button
  const handleYesClick = () => {
    setAccepted(true);
  };

  // Countdown timer
  useEffect(() => {
    if (!countdownActive || !noVisible) return;

    const timer = setInterval(() => {
      setCountdown(previous => {
        if (previous <= 1) {
          clearInterval(timer);
          setNoVisible(false);
          setCountdownActive(false);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownActive, noVisible]);

  // Date and time form submission
  const submitPlan = (e) => {
    e.preventDefault();

    if (!date || date < MIN_DATE) return;

    const formattedTime = formatTime(time);
    const validTime = /^(0[1-9]|1[0-2]):[0-5]\d (AM|PM)$/;

    if (!validTime.test(formattedTime)) {
      alert('Please enter a valid time, like 7:00 AM or 06:30 PM.');
      return;
    }

    setTime(formattedTime);
    setSent(true);
  };

  // Share date plan
  const sharePlan = () => {
    const message = `IT'S A DATE! 💛

Temple date at Aranmula Parthasarathy Temple

Date: ${date}
Time: ${time}${note ? `\nNote: ${note}` : ''}

You + me + a little peaceful time together. ✨`;

    if (navigator.share) {
      navigator.share({
        title: 'Our temple date 💛',
        text: message
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(message)
        .then(() => alert('Our date plan has been copied 💛'))
        .catch(() => alert('Unable to copy the plan. Please try again.'));
    }
  };

  // YES grows with every NO click
  const yesScale = Math.min(1 + noClicks * 0.15, 1.65);

  return (
    <main className="page-shell">
      <div className="grain" />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <AnimatePresence mode="wait">
        {!started ? (
          /* INTRO SPLASH SCREEN */
          <motion.section
            className="splash-screen"
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
            transition={{ duration: 0.8 }}
          >
            <div className="splash-glow splash-glow-one" />
            <div className="splash-glow splash-glow-two" />

            {/* Floating golden particles */}
            {Array.from({ length: 16 }, (_, i) => (
              <motion.span
                key={i}
                className="splash-particle"
                style={{
                  left: `${(i * 43 + 9) % 100}%`,
                  top: `${(i * 29 + 13) % 100}%`
                }}
                animate={{
                  y: [0, -25, 0],
                  opacity: [0.2, 0.85, 0.2],
                  scale: [0.7, 1.2, 0.7]
                }}
                transition={{
                  duration: 3 + (i % 4),
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                ✦
              </motion.span>
            ))}

            <motion.div
              className="splash-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.div
                className="splash-heart"
                animate={{
                  scale: [1, 1.12, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Heart size={30} fill="currentColor" />
              </motion.div>

              <div className="splash-kicker">
                <Sparkles size={14} />
                SOMETHING SPECIAL AWAITS
                <Sparkles size={14} />
              </div>

              <motion.h1
                className="splash-title"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                A little surprise
                <br />
                <em>just for you.</em>
              </motion.h1>

              <motion.p
                className="splash-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
               
                I have one little question for you.
              </motion.p>

              <motion.div
                className="splash-divider"
                initial={{ width: 0 }}
                animate={{ width: 75 }}
                transition={{ duration: 1, delay: 1.5 }}
              />

              <motion.p
                className="splash-question"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.7 }}
              >
                Are you ready for this?
              </motion.p>

              <motion.button
                className="splash-button"
                onClick={() => setStarted(true)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 2 }}
              >
                LET'S FIND OUT
                <ArrowUpRight size={17} />
              </motion.button>

              <motion.span
                className="splash-bottom-note"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
              >
                made with a little extra love ♡
              </motion.span>
            </motion.div>
          </motion.section>
        ) : (
          /* MAIN INVITATION */
          <motion.div
            className="invitation-screen"
            key="invitation"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            {/* Floating petals */}
            {floaters.map(f => (
              <motion.span
                key={f.id}
                className="petal"
                style={{ left: f.left }}
                initial={{ y: '110vh', opacity: 0 }}
                animate={{
                  y: '-12vh',
                  opacity: [0, 0.65, 0.65, 0],
                  rotate: [0, 120, 260]
                }}
                transition={{
                  duration: f.duration,
                  delay: f.delay,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                ✿
              </motion.span>
            ))}

            {/* Navigation */}
            <nav className="topbar">
              <div className="brand">
                <span className="brand-mark">
                  <Flower2 size={16} />
                </span>
                a little something
              </div>

              <div className="top-note">
                <span className="live-dot" />
                made with a little extra love
              </div>
            </nav>

            <section className="hero">
              {/* Heading */}
              <motion.div
                className="eyebrow"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Sparkles size={14} />
                AN IMPORTANT QUESTION
                <Sparkles size={14} />
              </motion.div>

              {/* Aranmula Temple image */}
              <motion.div
                className="hero-art"
                initial={{ opacity: 0, scale: 0.86, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="temple-image-wrapper">
                  <img
                    src={templeImage}
                    alt="Aranmula Parthasarathy Temple"
                    className="temple-image"
                  />
                  <div className="temple-image-overlay" />
                </div>

                <motion.div
                  className="tiny-star star-a"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                >
                  <Sparkles />
                </motion.div>

                <motion.div
                  className="tiny-star star-b"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles />
                </motion.div>
              </motion.div>

              <motion.p className="pre-title">
                I was thinking…
              </motion.p>

              <motion.h1>
                What do you say to a little<br />
                <em>temple date</em> with me?
              </motion.h1>

              <motion.p className="subtitle">
                A little temple visit, a little wandering around,
                <br className="desktop-break" />
                and a whole lot of time with my favourite person. ♡
              </motion.p>

              <AnimatePresence mode="wait">
                {!accepted ? (
                  <motion.div
                    className="choices"
                    key="choices"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    {/* YES BUTTON */}
                    <motion.button
                      className="yes-button"
                      animate={{ scale: yesScale }}
                      transition={{
                        type: 'spring',
                        stiffness: 220,
                        damping: 14
                      }}
                      whileTap={{ scale: yesScale * 0.94 }}
                      onClick={handleYesClick}
                    >
                      <Heart size={18} fill="currentColor" />
                      YES, LET'S GO!
                      <span className="button-sparkle">✦</span>
                    </motion.button>

                    {/* NO BUTTON */}
                    <AnimatePresence>
                      {noVisible && (
                        <motion.button
                          key="no-button"
                          className="no-button"
                          initial={{ opacity: 1, scale: 1 }}
                          animate={{
                            x: noPosition.x,
                            y: noPosition.y,
                            opacity: 1
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0,
                            rotate: 180
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 18
                          }}
                          onMouseEnter={() => {
                            if (noClicks >= 2) {
                              dodgeNo();
                            }
                          }}
                          onClick={handleNoClick}
                        >
                          No 🙃
                        </motion.button>
                      )}
                    </AnimatePresence>

                    {/* HINTS */}
                    <AnimatePresence mode="wait">
                      {noClicks === 0 && (
                        <motion.p className="tiny-hint" key="hint1">
                          Psst… the “No” button is a little shy.
                        </motion.p>
                      )}

                      {noClicks === 1 && noVisible && (
                        <motion.p
                          className="tiny-hint"
                          key="hint2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          Ohooo! Try clicking NO again! 🤭
                          <br />
                          YES is getting bigger!
                        </motion.p>
                      )}

                      {noClicks >= 2 && noVisible && (
                        <motion.p
                          className="tiny-hint countdown-hint"
                          key="hint3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          Catch me if you can! 😜
                          <br />
                          NO disappears in{' '}
                          <strong>{countdown}</strong> seconds...
                        </motion.p>
                      )}

                      {!noVisible && (
                        <motion.p
                          className="tiny-hint"
                          key="hint4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          No more escape routes! Click YES! ❤️
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  /* ACCEPTED SCREEN AND DATE FORM */
                  <motion.div
                    className="accepted-card"
                    key="accepted"
                    initial={{ opacity: 0, scale: 0.8, y: 25 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 150,
                      damping: 16
                    }}
                  >
                    <div className="confetti-heart">
                      <Heart fill="currentColor" size={25} />
                    </div>

                    <div className="accepted-kicker">
                      <Sparkles size={13} />
                      EXCELLENT DECISION
                      <Sparkles size={13} />
                    </div>

                    <h2>YAYYY! It's a <em>date!</em></h2>

                    <p className="accepted-copy">
                      I knew you had excellent taste. 🤭
                      <br />
                      Now, let's pick our little adventure.
                    </p>

                    <div className="destination">
                      <div className="destination-icon">
                        <MapPin size={20} />
                      </div>

                      <div>
                        <span>OUR DESTINATION</span>
                        <strong>Aranmula Parthasarathy Temple</strong>
                        <small>Aranmula, Kerala</small>
                      </div>

                      <span className="destination-heart">♡</span>
                    </div>

                    {!sent ? (
                      <form className="date-form" onSubmit={submitPlan}>
                        <label>
                          <span>
                            <CalendarDays size={15} />
                            WHICH DAY WORKS FOR YOU?
                          </span>

                          <input
                            id="date"
                            name="date"
                            type="date"
                            value={date}
                            min={MIN_DATE}
                            onChange={e => setDate(e.target.value)}
                            required
                          />
                        </label>

                        <label>
                          <span>
                            <Clock3 size={15} />
                            AND WHAT TIME?
                          </span>

                          <input
                            id="time"
                            name="time"
                            type="text"
                            inputMode="text"
                            placeholder="e.g. 7:00 AM"
                            value={time}
                            onChange={e => setTime(e.target.value.toUpperCase())}
                            onBlur={() => setTime(formatTime(time))}
                            autoComplete="off"
                            maxLength={8}
                            required
                          />

                          
                        </label>

                        <label>
                          <span>
                            <Heart size={15} />
                            ANYTHING ELSE I SHOULD KNOW?
                          </span>

                          <input
                            id="note"
                            name="note"
                            type="text"
                            placeholder="e.g. Can't wait to see you! 🥹❤️"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                          />
                        </label>

                        <motion.button
                          className="confirm-button"
                          type="submit"
                          whileHover={{ scale: 1.025 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          LOCK IN OUR DATE
                          <ArrowUpRight size={17} />
                        </motion.button>
                      </form>
                    ) : (
                      <motion.div
                        className="confirmed"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="check-circle">
                          <Check size={24} />
                        </div>

                        <h3>It's officially happening!</h3>

                        <p>
                          I've got our date idea. Now all that's left
                          is to show up and make a lovely memory. 💛
                        </p>

                        <button
                          className="confirm-button"
                          onClick={sharePlan}
                        >
                          SHARE OUR PLAN
                          <ArrowUpRight size={17} />
                        </button>

                        <button
                          className="edit-link"
                          onClick={() => setSent(false)}
                        >
                          Change the date or time
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div className="destination-foot">
                <span>
                  <MapPin size={13} /> ARANMULA, KERALA
                </span>
                <span className="foot-separator">✦</span>
                <span>JUST YOU & ME</span>
              </motion.div>
            </section>

            <footer>
              <span>
                crafted with
                <Heart size={11} fill="currentColor" />
                and questionable levels of excitement
              </span>

              <span className="footer-sun">
                <Sun size={14} />
                good vibes only
              </span>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
