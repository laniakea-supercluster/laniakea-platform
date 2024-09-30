CREATE TABLE public.country (
	id int GENERATED ALWAYS AS IDENTITY NOT NULL,
	code int NOT NULL,
	"name" varchar(50) NOT NULL,
	mcc int NOT NULL,
	initials varchar(5) NOT NULL,
	lang_encode varchar(10) NOT NULL,
	created_on timestamp NOT NULL,
	changed_on timestamp NOT NULL,
	signature varchar(128) NOT NULL,
	CONSTRAINT country_pk PRIMARY KEY (id),
	CONSTRAINT country_unique_code UNIQUE (code),
	CONSTRAINT country_unique_name UNIQUE ("name"),
	CONSTRAINT country_unique_mcc UNIQUE (mcc),
	CONSTRAINT country_unique_initials UNIQUE (initials),
	CONSTRAINT country_unique_signature UNIQUE (signature)
);
CREATE UNIQUE INDEX country_created_on_idx ON public.country (created_on,changed_on);
