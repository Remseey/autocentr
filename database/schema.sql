CREATE DATABASE IF NOT EXISTS primecar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE primecar;

DROP USER IF EXISTS 'primecar_app'@'localhost';
CREATE USER 'primecar_app'@'localhost' IDENTIFIED BY 'Primecar123!';
GRANT ALL PRIVILEGES ON primecar.* TO 'primecar_app'@'localhost';
FLUSH PRIVILEGES;

DROP TABLE IF EXISTS feedback_messages;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(32) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand VARCHAR(80) NOT NULL,
  model VARCHAR(120) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  year INT NOT NULL,
  mileage INT NOT NULL,
  engine VARCHAR(80) NOT NULL,
  body_type VARCHAR(60) NOT NULL,
  transmission VARCHAR(60) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'active',
  featured TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  short_description TEXT NOT NULL,
  feature_list TEXT NOT NULL,
  base_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  badge VARCHAR(20) NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_car FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  service_package VARCHAR(180) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  comment TEXT NULL,
  contact_phone VARCHAR(32) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_orders_car FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

CREATE TABLE feedback_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(32) NULL,
  topic VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Администратор PRIMECAR', 'admin@primecar.local', '+7 (900) 000-00-01', 'c7f0ecdd1e3daa16a5ca2a3faf7140e7:ad9b900a05c6c4208d4b8bbca04a4804feb3633e016051d13ec4b0fa976aefec869efcc8ad7031fe41945a70479052f804b3e8698769e33338ba65b830c371b9', 'admin'),
('Александр Петров', 'alex@example.com', '+7 (900) 000-00-02', 'c7f0ecdd1e3daa16a5ca2a3faf7140e7:ad9b900a05c6c4208d4b8bbca04a4804feb3633e016051d13ec4b0fa976aefec869efcc8ad7031fe41945a70479052f804b3e8698769e33338ba65b830c371b9', 'user');

INSERT INTO cars (brand, model, slug, year, mileage, engine, body_type, transmission, price, description, image_url, status, featured) VALUES
('Mercedes-Benz', 'S-Class', 'mercedes-benz-s-class', 2023, 15000, '3.0 AMG', 'Седан', 'Автомат', 12500000, 'Флагманский седан с безупречным состоянием, цифровым кокпитом и полным пакетом опций для представительских поездок.', '/static/images/mercedes-s-class.jpg', 'active', 1),
('BMW', '7 Series', 'bmw-7-series', 2024, 5000, '4.4 V8', 'Седан', 'Автомат', 14200000, 'Последнее поколение бизнес-флагмана BMW с выразительным дизайном, мягкой посадкой и новым уровнем мультимедиа.', '/static/images/bmw-7-series.jpg', 'active', 1),
('Audi', 'A8 L', 'audi-a8-l', 2023, 22000, '3.0 TFSI', 'Седан', 'Автомат', 9800000, 'Удлинённая версия A8 для тех, кому нужен спокойный премиум без компромиссов по оснащению и комфорту.', '/static/images/audi-a8.jpg', 'active', 1),
('Porsche', 'Panamera Turbo S', 'porsche-panamera-turbo-s', 2023, 18000, '4.0 V8', 'Лифтбек', 'РКПП', 16900000, 'Четырёхдверный GT с мощной динамикой и ежедневной пригодностью. Подходит для владельца, который не готов терять в эмоциях.', '/static/images/porsche-panamera.jpg', 'active', 0),
('Lexus', 'LS 500h', 'lexus-ls-500h', 2023, 12000, '3.5 Hybrid', 'Седан', 'Автомат', 8500000, 'Гибридный представительский седан с фирменной надёжностью Lexus, высокой тишиной хода и мягкой отделкой салона.', '/static/images/lexus-ls.jpg', 'active', 0),
('Mercedes-AMG', 'GT 63 S', 'mercedes-amg-gt-63-s', 2024, 3000, '4.0 V8 BiTurbo', 'Лифтбек', 'Автомат', 18400000, 'Спортивный фастбек с акцентом на драйв, быстрые перестроения и плотную связь с дорогой.', '/static/images/mercedes-amg-gt.jpg', 'active', 0);

INSERT INTO services (title, short_description, feature_list, base_price, badge, sort_order) VALUES
('Комиссионная продажа', 'Выставляем автомобиль, проверяем покупателей, контролируем показы и закрываем сделку документально.', 'Рыночная оценка\nПрофессиональная съёмка\nРазмещение на площадках\nПроверка покупателей\nПолное оформление', 90000, '01', 1),
('Trade-In', 'Быстрая оценка текущего автомобиля и зачёт стоимости при покупке новой позиции из каталога.', 'Оценка за 30 минут\nЗачёт до 100%\nРабота с любыми марками\nМинимум документов', 0, '02', 2),
('Подбор автомобиля', 'Ищем нужную конфигурацию по параметрам, проверяем юридическую историю и техсостояние.', 'Поиск по ТЗ\nПроверка истории\nДиагностика\nПереговоры с продавцом', 25000, '03', 3),
('Срочный выкуп', 'Оцениваем автомобиль и закрываем сделку в сжатые сроки, если нужна быстрая ликвидность.', 'Оценка за 15 минут\nОплата в день сделки\nВыезд эксперта\nСнятие с учёта', 0, '04', 4),
('Кредит и лизинг', 'Подбор программ финансирования для физлиц и компаний под конкретный сценарий покупки.', 'Партнёрские банки\nРешение за несколько часов\nИндивидуальный платёж\nСопровождение документов', 0, '05', 5),
('Регистрация и страхование', 'Закрываем постпродажные вопросы, чтобы покупатель не тратил время на рутину.', 'Постановка на учёт\nОСАГО и КАСКО\nНомера\nДоставка документов', 120000, '06', 6);

INSERT INTO reviews (car_id, user_id, rating, comment) VALUES
(1, 2, 5, 'Сделка прошла спокойно и прозрачно. Машина соответствовала описанию, сопровождение было на уровне.'),
(2, 2, 5, 'Очень сильная подача каталога и грамотная консультация по комплектации.'),
(4, 2, 4, 'Быстро согласовали осмотр и оформили документы без лишней бюрократии.');

INSERT INTO orders (user_id, car_id, service_package, total_amount, comment, contact_phone, status) VALUES
(2, 1, 'Постановка на учет и страховка', 12620000, 'Нужна выдача в пятницу.', '+7 (900) 000-00-02', 'in_progress');

INSERT INTO feedback_messages (user_id, name, email, phone, topic, message, status) VALUES
(2, 'Александр Петров', 'alex@example.com', '+7 (900) 000-00-02', 'Подбор Panamera', 'Интересует подбор Panamera с историей обслуживания у официального дилера.', 'new');
