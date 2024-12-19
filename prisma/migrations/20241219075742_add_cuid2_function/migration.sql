
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateFunction
CREATE OR REPLACE FUNCTION gen_cuid2() 
RETURNS VARCHAR(128)
LANGUAGE plpgsql
AS $$
DECLARE
  timestamp_hex VARCHAR;
  fingerprint VARCHAR;
BEGIN
  timestamp_hex := LPAD(TO_HEX(EXTRACT(EPOCH FROM NOW())::BIGINT), 8, '0');
  fingerprint := ENCODE(GEN_RANDOM_BYTES(12), 'hex');
  RETURN timestamp_hex || fingerprint;
END;
$$;