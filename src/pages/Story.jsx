import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function Story() {
  const ArrowLeftIcon = getIcon('ArrowLeft');

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const staggerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="container mx-auto px-4 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 mb-8 text-primary-600 dark:text-primary-400 hover:underline"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to home
        </Link>
        
        <motion.div 
          className="prose prose-lg dark:prose-invert mx-auto"
          variants={staggerVariants}
        >
          <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-6 text-center">Our Story</motion.h1>
          
          <motion.img 
            variants={itemVariants}
            src="https://images.unsplash.com/photo-1556012018-50c5c0da73bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
            alt="Our workshop" 
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md mb-8"
          />
          
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4">How It All Started</h2>
            <p>CraftCart began in 2018 as a small home-based operation run by artisan Jane Smith. What started as a passionate hobby quickly evolved into a thriving business when Jane's handcrafted pottery gained attention at local markets.</p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>We believe in the beauty of human-made creations. In a world of mass production, our mission is to celebrate the unique character of handcrafted items and support the artisans who create them. Every product tells a story and carries the distinctive mark of its creator.</p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4">Our Artisans</h2>
            <p>Today, CraftCart partners with over 50 skilled artisans across the country, providing a platform for them to showcase their talents and reach customers who appreciate the value of handmade. Each artisan brings their unique perspective and traditional techniques, resulting in a diverse collection of authentic, high-quality products.</p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <p className="mt-8 italic">Thank you for supporting small businesses and independent craftspeople. Every purchase directly impacts the livelihood of our artisan community.</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Story;