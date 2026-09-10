"use client";

import { motion } from "framer-motion";

// framer-motion's `motion.div` proxy can't be re-exported and accessed by
// property (motion.div) through a "use client" barrel - Next's RSC bundler
// needs a stable named client reference, so each primitive gets its own
// export instead. JSX children passed into these from a Server Component
// still render server-side; only the motion wrapper itself is a client
// boundary.
export const MotionDiv = motion.div;
