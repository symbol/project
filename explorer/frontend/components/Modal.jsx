import Card from './Card';
import styles from '@/styles/components/Modal.module.scss';
import { useEffect } from 'react';

const Modal = ({ children, className, isVisible, onClose }) => {
	const handleCardClick = e => {
		e.stopPropagation();
	};

	useEffect(() => {
		if (isVisible) 
			document.body.classList.add('disable-scroll');
		else 
			document.body.classList.remove('disable-scroll');
	}, [isVisible]);

	return isVisible ? (
		<div role="dialog" className={styles.overlay} onClick={onClose}>
			<Card className={`${styles.modal} ${className}`} onClick={handleCardClick}>
				{children}
			</Card>
		</div>
	) : null;
};

export default Modal;