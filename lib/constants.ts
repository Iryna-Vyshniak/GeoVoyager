import { Color } from "three";

/**
 * Основні параметри сторінок книги у 3D:
 * - PAGE_SEGMENTS: створює поділ сторінки на сегменти для згинання.
 * - Кожна вершина прив’язується до кісток, що дозволяє згинати сторінку.
 * - Матеріали та текстури додають реалістичності.
 * - Попереднє завантаження текстур покращує продуктивність.
 * 
 * Цей код – основа для інтерактивної книги, яка анімовано перегортає сторінки у React Three Fiber. 🚀
 */


export const PAGE_WIDTH = 1.28;
export const PAGE_HEIGHT = 1.71; // 4:3 aspect ratio
export const PAGE_DEPTH = 0.005; // робить сторінку дуже тонкою
export const PAGE_SEGMENTS = 30; // Поділ сторінки на сегменти для плавного згинання - розбиває сторінку на 30 частин
export const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;
export const SCALE = 400;  // 100 → низька роздільна здатність (128px x 171px), підходить для маленьких об’єктів; 200 → середня роздільна здатність (256px x 342px), краще для більшості випадків; 400 → висока роздільна здатність (512px x 684px), для великих об’єктів або деталізації.



export const EASING_FACTOR = 0.5; // Швидкість плавного руху сторінок
export const EASING_FACTOR_FOLD = 0.3; // Швидкість згинання сторінки
export const INSIDE_CURVE_STRENGTH = 0.18; // Сила викривлення всередину
export const OUTSIDE_CURVE_STRENGTH = 0.05; // Сила викривлення назовні
export const TURNING_CURVE_STRENGTH = 0.09; // Сила викривлення при перегортанні

export const WHITE_COLOR = new Color('#ffffff');
export const EMISSIVE_COLOR = new Color('#fc7804');

