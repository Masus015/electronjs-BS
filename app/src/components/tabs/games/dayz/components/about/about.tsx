

const isProd = process.env.NODE_ENV === 'production';
const assetPrefix = isProd ? '' : '';
import styles from './about.module.css';

export default function About() {
	return (
		<div className={styles.centerWrapper}>
			<div>
				<img src={`${assetPrefix}images/dayz/dayz.png`} alt="DayZ" className={styles.image} />
				<p className={styles.desc}>
					DayZ — многопользовательская компьютерная игра в жанре симулятора выживания с открытым миром, разработанная чешской компанией Bohemia Interactive. Игра является ремейком одноимённой модификации к Arma 2, созданной геймдизайнером Дином Холлом.
				</p>
			</div>
		</div>
	);
}
