/*==============================================================*/
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     04.05.2022 14:41:34                          */
/*==============================================================*/


drop index BENUTZER_PK;

drop table BENUTZER;

drop index BENUTZER_GEHOERT_BILD_FK;

drop index BILD_PK;

drop table BILD;

drop index BILD_HAT_MEHERE_KATEGORIEN_FK;

drop index KATEGORIE_BESTIZT_BILDER_FK;

drop index BILD2KATEGORIE_PK;

drop table BILD2KATEGORIE;

drop index KATEGORIE_PK;

drop table KATEGORIE;

drop index ZIP_PK;

drop table ZIP;

drop index ZIP_HAT_MEHRERE_BILDER_FK;

drop index BILD_IN_MEHREN_ZIPS_FK;

drop index ZIP2BILD_PK;

drop table ZIP2BILD;

/*==============================================================*/
/* Table: BENUTZER                                              */
/*==============================================================*/
create table BENUTZER (
   IDBENUTZER           INT4                 not null,
   NAME                 TEXT                 null,
   EMAIL                TEXT                 null,
   PASSWORT             TEXT                 null,
   SESSIONID            TEXT                 null,
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
   /*constraint PK_BILD2KATEGORIE primary key (IDBILD, IDKATEGORIE)*/
   constraint FK_BILD2KAT_BILD_HAT__BILD foreign key (IDBILD)
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
/* Index: KATEGORIE_BESTIZT_BILDER_FK                           */
/*==============================================================*/
create  index KATEGORIE_BESTIZT_BILDER_FK on BILD2KATEGORIE (
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

/*==============================================================*/
/* Table: ZIP                                                   */
/*==============================================================*/
create table ZIP (
   IDBENUTZER           INT4                 not null,
   constraint PK_ZIP primary key (IDBENUTZER)
   constraint FK_ZIP_BENUTZER__BENUTZER foreign key (IDBENUTZER)
      references BENUTZER (IDBENUTZER)
      on delete restrict on update restrict
);

/*==============================================================*/
/* Index: ZIP_PK                                                */
/*==============================================================*/
create unique index ZIP_PK on ZIP (
IDBENUTZER
);

/*==============================================================*/
/* Table: ZIP2BILD                                              */
/*==============================================================*/
create table ZIP2BILD (
   IDBENUTZER           INT4                 not null,
   IDBILD               INT4                 not null,
   constraint PK_ZIP2BILD primary key (IDBENUTZER, IDBILD)
   constraint FK_ZIP2BILD_BILD_IN_M_BILD foreign key (IDBILD)
      references BILD (IDBILD)
      on delete restrict on update restrict
	constraint FK_ZIP2BILD_ZIP_HAT_M_ZIP foreign key (IDBENUTZER)
      references ZIP (IDBENUTZER)
      on delete restrict on update restrict
);

/*==============================================================*/
/* Index: ZIP2BILD_PK                                           */
/*==============================================================*/
create unique index ZIP2BILD_PK on ZIP2BILD (
IDBENUTZER,
IDBILD
);

/*==============================================================*/
/* Index: BILD_IN_MEHREN_ZIPS_FK                                */
/*==============================================================*/
create  index BILD_IN_MEHREN_ZIPS_FK on ZIP2BILD (
IDBILD
);

/*==============================================================*/
/* Index: ZIP_HAT_MEHRERE_BILDER_FK                             */
/*==============================================================*/
create  index ZIP_HAT_MEHRERE_BILDER_FK on ZIP2BILD (
IDBENUTZER
);

