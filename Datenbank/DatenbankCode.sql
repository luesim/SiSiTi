/*==============================================================*/
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     27.04.2022 16:33:00                          */
/*==============================================================*/


drop index BENUTZER_PK;

drop table BENUTZER;

drop index BENUTZER_GEHOERT_BILD_FK;

drop index BILD_PK;

drop table BILD;

drop index BILD_HAT_MEHERE_KATEGORIEN_FK;

drop index KATEGORIE2BILD;

drop index BILD2KATEGORIE_PK;

drop table BILD2KATEGORIE;

drop index KATEGORIE_PK;

drop table KATEGORIE;

/*==============================================================*/
/* Table: BENUTZER                                              */
/*==============================================================*/
create table BENUTZER (
   IDBENUTZER           INT4                 not null,
   NAME                 TEXT                 null,
   EMAIL                TEXT                 null,
   PASSWORT             TEXT                 null,
   constraint PK_BENUTZER primary key (IDBENUTZER)
);

/*==============================================================*/
/* Index: BENUTZER_PK                                           */
/*==============================================================*/
create unique index BENUTZER_PK on BENUTZER (
IDBENUTZER
);

/*==============================================================*/
/* Table: BILD                                                  */
/*==============================================================*/
create table BILD (
   IDBILD               INT4                 not null,
   IDBENUTZER           INT4                 null,
   BILDPFAD             TEXT                 null,
   BILDNAME             TEXT                 null,
   AUFLOESUNG           TEXT                 null,
   BILDTYP              TEXT                 null,
   DATUM                DATE                 null,
   constraint PK_BILD primary key (IDBILD)
   constraint FK_BILD_BENUTZER__BENUTZER foreign key (IDBENUTZER)
      references BENUTZER (IDBENUTZER)
      on delete restrict on update restrict
);

/*==============================================================*/
/* Index: BILD_PK                                               */
/*==============================================================*/
create unique index BILD_PK on BILD (
IDBILD
);

/*==============================================================*/
/* Index: BENUTZER_GEHOERT_BILD_FK                              */
/*==============================================================*/
create  index BENUTZER_GEHOERT_BILD_FK on BILD (
IDBENUTZER
);

/*==============================================================*/
/* Table: BILD2KATEGORIE                                        */
/*==============================================================*/
create table BILD2KATEGORIE (
   IDBILD               INT4                 not null,
   IDKATEGORIE          INT4                 not null,
   constraint PK_BILD2KATEGORIE primary key (IDBILD, IDKATEGORIE)
   constraint FK_BILD2KAT_BILD2KATE_BILD foreign key (IDBILD)
      references BILD (IDBILD)
      on delete restrict on update restrict
	constraint FK_BILD2KAT_KATEGORIE_KATEGORI foreign key (IDKATEGORIE)
      references KATEGORIE (IDKATEGORIE)
      on delete restrict on update restrict
);

/*==============================================================*/
/* Index: BILD2KATEGORIE_PK                                     */
/*==============================================================*/
create unique index BILD2KATEGORIE_PK on BILD2KATEGORIE (
IDBILD,
IDKATEGORIE
);

/*==============================================================*/
/* Index: KATEGORIE2BILD                                        */
/*==============================================================*/
create  index KATEGORIE2BILD on BILD2KATEGORIE (
IDKATEGORIE
);

/*==============================================================*/
/* Index: BILD_HAT_MEHERE_KATEGORIEN_FK                         */
/*==============================================================*/
create  index BILD_HAT_MEHERE_KATEGORIEN_FK on BILD2KATEGORIE (
IDBILD
);

/*==============================================================*/
/* Table: KATEGORIE                                             */
/*==============================================================*/
create table KATEGORIE (
   IDKATEGORIE          INT4                 not null,
   BEZEICHNUNG          TEXT                 null,
   constraint PK_KATEGORIE primary key (IDKATEGORIE)
);

/*==============================================================*/
/* Index: KATEGORIE_PK                                          */
/*==============================================================*/
create unique index KATEGORIE_PK on KATEGORIE (
IDKATEGORIE
);


