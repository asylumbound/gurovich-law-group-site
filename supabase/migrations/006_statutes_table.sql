-- Create statutes table for California legal statutes
CREATE TABLE IF NOT EXISTS statutes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) NOT NULL,
  section VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  summary TEXT NOT NULL,
  full_text TEXT,
  practice_area VARCHAR(100) NOT NULL,
  jurisdiction VARCHAR(50) DEFAULT 'California',
  effective_date DATE,
  url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for searching
CREATE INDEX IF NOT EXISTS idx_statutes_practice_area ON statutes(practice_area);
CREATE INDEX IF NOT EXISTS idx_statutes_code_section ON statutes(code, section);

-- Seed California Personal Injury statutes
INSERT INTO statutes (code, section, title, summary, practice_area, jurisdiction) VALUES
('Cal. Civ. Code', '1714', 'General Negligence', 'Everyone is responsible for an injury occasioned to another by his or her want of ordinary care or skill in the management of his or her property or person.', 'Personal Injury', 'California'),
('Cal. Civ. Code', '1714.1', 'Parental Liability', 'Any act of willful misconduct of a minor that results in injury or death to another person or property damage shall be imputed to the parent or guardian.', 'Personal Injury', 'California'),
('Cal. Civ. Code', '3333', 'Tort Damages', 'For the breach of an obligation not arising from contract, the measure of damages is the amount which will compensate for all the detriment proximately caused.', 'Personal Injury', 'California'),
('Cal. Civ. Code', '3294', 'Punitive Damages', 'In an action for breach of obligation not arising from contract, where defendant has been guilty of oppression, fraud, or malice, plaintiff may recover damages for the sake of example.', 'Personal Injury', 'California'),
('Cal. Code Civ. Proc.', '335.1', 'Personal Injury Statute of Limitations', 'An action for assault, battery, or injury to, or for the death of, an individual caused by the wrongful act or neglect of another must be commenced within two years.', 'Personal Injury', 'California'),
('Cal. Civ. Code', '1431.2', 'Several Liability for Non-Economic Damages', 'In any action for personal injury, property damage, or wrongful death, each defendant shall be liable only for the amount of non-economic damages allocated to that defendant.', 'Personal Injury', 'California'),
('Cal. Civ. Code', '846', 'Recreational Use Immunity', 'An owner of any estate or interest in real property owes no duty of care to keep the premises safe for entry for recreational purposes.', 'Personal Injury', 'California'),
('Cal. Civ. Code', '1714.45', 'Product Liability', 'A manufacturer, distributor, or retailer is not liable for injuries caused by inherent characteristics of a product that are known to the ordinary consumer.', 'Personal Injury', 'California'),
('Cal. Bus. & Prof. Code', '6146', 'Attorney Fee Limits in Medical Malpractice', 'An attorney shall not contract for or collect a contingency fee in excess of specified amounts in medical malpractice cases.', 'Personal Injury', 'California'),
('Cal. Civ. Code', '3333.2', 'Medical Malpractice Damage Cap', 'In any action for injury against a health care provider based on professional negligence, the injured plaintiff shall be entitled to recover noneconomic losses subject to a cap.', 'Personal Injury', 'California');

-- Seed California Defamation statutes
INSERT INTO statutes (code, section, title, summary, practice_area, jurisdiction) VALUES
('Cal. Civ. Code', '44', 'Defamation Definition', 'Defamation is effected by either: (a) Libel; or (b) Slander.', 'Civil Litigation', 'California'),
('Cal. Civ. Code', '45', 'Libel Definition', 'Libel is a false and unprivileged publication by writing, printing, picture, effigy, or other fixed representation which exposes any person to hatred, contempt, ridicule, or obloquy.', 'Civil Litigation', 'California'),
('Cal. Civ. Code', '45a', 'Libel Per Se', 'A libel which is defamatory of the plaintiff without the necessity of explanatory matter, such as an inducement, innuendo or other extrinsic fact, is said to be a libel on its face.', 'Civil Litigation', 'California'),
('Cal. Civ. Code', '46', 'Slander Definition', 'Slander is a false and unprivileged publication, orally uttered, which charges any person with crime, or with having been indicted or convicted of crime.', 'Civil Litigation', 'California'),
('Cal. Civ. Code', '47', 'Privileged Publications', 'A privileged publication is one made in the proper discharge of an official duty, in any legislative proceeding, in any judicial proceeding, or in any other official proceeding.', 'Civil Litigation', 'California'),
('Cal. Civ. Code', '48a', 'Defamation Retraction', 'In any action for damages for libel in a newspaper or slander by radio broadcast, plaintiff shall recover no more than special damages unless a correction is demanded and refused.', 'Civil Litigation', 'California');

-- Seed California Criminal Defense statutes
INSERT INTO statutes (code, section, title, summary, practice_area, jurisdiction) VALUES
('Cal. Penal Code', '187', 'Murder Definition', 'Murder is the unlawful killing of a human being, or a fetus, with malice aforethought.', 'Criminal Defense', 'California'),
('Cal. Penal Code', '192', 'Manslaughter', 'Manslaughter is the unlawful killing of a human being without malice. It is of three kinds: voluntary, involuntary, and vehicular.', 'Criminal Defense', 'California'),
('Cal. Penal Code', '211', 'Robbery', 'Robbery is the felonious taking of personal property in the possession of another, from his person or immediate presence, against his will, by means of force or fear.', 'Criminal Defense', 'California'),
('Cal. Penal Code', '459', 'Burglary', 'Every person who enters any house, room, apartment, or other building with intent to commit grand or petit larceny or any felony is guilty of burglary.', 'Criminal Defense', 'California'),
('Cal. Penal Code', '484', 'Theft', 'Every person who shall feloniously steal, take, carry, lead, or drive away the personal property of another is guilty of theft.', 'Criminal Defense', 'California'),
('Cal. Penal Code', '242', 'Battery', 'A battery is any willful and unlawful use of force or violence upon the person of another.', 'Criminal Defense', 'California'),
('Cal. Penal Code', '240', 'Assault', 'An assault is an unlawful attempt, coupled with a present ability, to commit a violent injury on the person of another.', 'Criminal Defense', 'California'),
('Cal. Penal Code', '23152', 'DUI', 'It is unlawful for a person who is under the influence of any alcoholic beverage to drive a vehicle.', 'Criminal Defense', 'California');

-- Seed California Employment Law statutes
INSERT INTO statutes (code, section, title, summary, practice_area, jurisdiction) VALUES
('Cal. Lab. Code', '201', 'Final Wages - Discharge', 'If an employer discharges an employee, the wages earned and unpaid at the time of discharge are due and payable immediately.', 'Employment', 'California'),
('Cal. Lab. Code', '202', 'Final Wages - Resignation', 'If an employee quits employment, wages become due and payable within 72 hours, unless the employee has given 72 hours notice.', 'Employment', 'California'),
('Cal. Lab. Code', '226', 'Wage Statements', 'Every employer shall furnish each employee an accurate itemized statement in writing showing gross wages earned, total hours worked, and all deductions.', 'Employment', 'California'),
('Cal. Lab. Code', '510', 'Overtime', 'Eight hours of labor constitutes a days work. Any work in excess of eight hours in one workday shall be compensated at one and one-half times the regular rate.', 'Employment', 'California'),
('Cal. Lab. Code', '1102.5', 'Whistleblower Protection', 'An employer may not retaliate against an employee for disclosing information to a government or law enforcement agency.', 'Employment', 'California'),
('Cal. Gov. Code', '12940', 'FEHA - Employment Discrimination', 'It is an unlawful employment practice for an employer to discriminate against any person in compensation or in terms of employment because of race, religion, color, national origin, sex, or disability.', 'Employment', 'California'),
('Cal. Lab. Code', '2698', 'PAGA - Private Attorneys General Act', 'Any provision of the Labor Code that provides for a civil penalty may be recovered through a civil action brought by an aggrieved employee on behalf of himself and other employees.', 'Employment', 'California'),
('Cal. Lab. Code', '512', 'Meal Periods', 'An employer may not employ an employee for a work period of more than five hours per day without providing a meal period of not less than 30 minutes.', 'Employment', 'California');

-- Seed California Tenant Rights statutes
INSERT INTO statutes (code, section, title, summary, practice_area, jurisdiction) VALUES
('Cal. Civ. Code', '1940', 'Tenant Rights', 'A hiring of real property for residential purposes creates certain rights and duties between landlord and tenant.', 'Tenant Rights', 'California'),
('Cal. Civ. Code', '1941', 'Habitability', 'The lessor of a building intended for human occupation must put it into a condition fit for such occupation and repair all subsequent dilapidations.', 'Tenant Rights', 'California'),
('Cal. Civ. Code', '1942.4', 'Rent Withholding', 'A landlord may not demand rent if the dwelling substantially lacks certain characteristics including effective waterproofing, plumbing, and heating.', 'Tenant Rights', 'California'),
('Cal. Civ. Code', '1946.2', 'Just Cause Eviction', 'An owner of residential real property shall not terminate a tenancy without just cause, which must be stated in the written notice to terminate.', 'Tenant Rights', 'California'),
('Cal. Civ. Code', '1947.12', 'Rent Cap', 'An owner of residential real property shall not increase the gross rental rate for a dwelling more than 5% plus the percentage change in cost of living.', 'Tenant Rights', 'California'),
('Cal. Civ. Code', '1950.5', 'Security Deposits', 'A landlord may not demand a security deposit in excess of two months rent for unfurnished property or three months rent for furnished property.', 'Tenant Rights', 'California');
