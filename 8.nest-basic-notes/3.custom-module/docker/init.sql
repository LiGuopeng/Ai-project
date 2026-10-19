CREATE TABLE IF NOT EXISTS details (
  name varchar,
  age varchar
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'details_name_key'
      AND conrelid = 'details'::regclass
  ) THEN
    ALTER TABLE details
      ADD CONSTRAINT details_name_key UNIQUE (name);
  END IF;
END
$$;
