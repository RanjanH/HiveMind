PGDMP                         |            hivemind    15.4    15.4                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16398    hivemind    DATABASE     {   CREATE DATABASE hivemind WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE hivemind;
                postgres    false            �            1259    16654    events    TABLE     �   CREATE TABLE public.events (
    id integer NOT NULL,
    name text,
    club text,
    date text,
    "time" text,
    descr text,
    venue text,
    whose text,
    who_no integer,
    per_no integer,
    uid text,
    link text
);
    DROP TABLE public.events;
       public         heap    postgres    false            �            1259    16653    events_id_seq    SEQUENCE     �   CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.events_id_seq;
       public          postgres    false    220                       0    0    events_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;
          public          postgres    false    219            �            1259    16608    faculty_details    TABLE     �   CREATE TABLE public.faculty_details (
    id integer NOT NULL,
    uid text,
    name text NOT NULL,
    uname text NOT NULL,
    branch text NOT NULL,
    post text NOT NULL
);
 #   DROP TABLE public.faculty_details;
       public         heap    postgres    false            �            1259    16607    faculty_details_id_seq    SEQUENCE     �   CREATE SEQUENCE public.faculty_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.faculty_details_id_seq;
       public          postgres    false    216                       0    0    faculty_details_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.faculty_details_id_seq OWNED BY public.faculty_details.id;
          public          postgres    false    215            �            1259    16637    student_details    TABLE     �   CREATE TABLE public.student_details (
    id integer NOT NULL,
    uid text,
    name text NOT NULL,
    uname text,
    year integer,
    branch text
);
 #   DROP TABLE public.student_details;
       public         heap    postgres    false            �            1259    16636    student_details_id_seq    SEQUENCE     �   CREATE SEQUENCE public.student_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.student_details_id_seq;
       public          postgres    false    218                       0    0    student_details_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.student_details_id_seq OWNED BY public.student_details.id;
          public          postgres    false    217            �            1259    16548    users    TABLE     �   CREATE TABLE public.users (
    uid text NOT NULL,
    email character varying(100) NOT NULL,
    hash text,
    userno integer
);
    DROP TABLE public.users;
       public         heap    postgres    false            u           2604    16657 	   events id    DEFAULT     f   ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);
 8   ALTER TABLE public.events ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            s           2604    16611    faculty_details id    DEFAULT     x   ALTER TABLE ONLY public.faculty_details ALTER COLUMN id SET DEFAULT nextval('public.faculty_details_id_seq'::regclass);
 A   ALTER TABLE public.faculty_details ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216            t           2604    16640    student_details id    DEFAULT     x   ALTER TABLE ONLY public.student_details ALTER COLUMN id SET DEFAULT nextval('public.student_details_id_seq'::regclass);
 A   ALTER TABLE public.student_details ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218                      0    16654    events 
   TABLE DATA           n   COPY public.events (id, name, club, date, "time", descr, venue, whose, who_no, per_no, uid, link) FROM stdin;
    public          postgres    false    220   �"                 0    16608    faculty_details 
   TABLE DATA           M   COPY public.faculty_details (id, uid, name, uname, branch, post) FROM stdin;
    public          postgres    false    216   �#                 0    16637    student_details 
   TABLE DATA           M   COPY public.student_details (id, uid, name, uname, year, branch) FROM stdin;
    public          postgres    false    218   �$                 0    16548    users 
   TABLE DATA           9   COPY public.users (uid, email, hash, userno) FROM stdin;
    public          postgres    false    214   �$                   0    0    events_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.events_id_seq', 4, true);
          public          postgres    false    219            !           0    0    faculty_details_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.faculty_details_id_seq', 1, false);
          public          postgres    false    215            "           0    0    student_details_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.student_details_id_seq', 12, true);
          public          postgres    false    217                       2606    16661    events events_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.events DROP CONSTRAINT events_pkey;
       public            postgres    false    220            {           2606    16615 $   faculty_details faculty_details_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.faculty_details
    ADD CONSTRAINT faculty_details_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.faculty_details DROP CONSTRAINT faculty_details_pkey;
       public            postgres    false    216            }           2606    16644 $   student_details student_details_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.student_details
    ADD CONSTRAINT student_details_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.student_details DROP CONSTRAINT student_details_pkey;
       public            postgres    false    218            w           2606    16556    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    214            y           2606    16554    users users_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    214            �           2606    16616 (   faculty_details faculty_details_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.faculty_details
    ADD CONSTRAINT faculty_details_uid_fkey FOREIGN KEY (uid) REFERENCES public.users(uid) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.faculty_details DROP CONSTRAINT faculty_details_uid_fkey;
       public          postgres    false    3193    216    214            �           2606    16645 (   student_details student_details_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.student_details
    ADD CONSTRAINT student_details_uid_fkey FOREIGN KEY (uid) REFERENCES public.users(uid) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.student_details DROP CONSTRAINT student_details_uid_fkey;
       public          postgres    false    214    218    3193               *  x����N�0���S���vBb�I!$Hc�Ҕe�ɖ&U�*��i����vl��_����ܾ�u'/mwD'�o���֔MYW�ز��.o��;���p�!%�B*�"7T&�#�x�1��P��ϭAz��)2�p�0�+L�c�c��D(`C�2��$�z�`��1�����QPC�n C���,c�Ekm����<� G�oƛ��O�둈w9���B���0�A:;�/"�O�_9�T����'�O��:�����THp��Ik�B����L?�M���x����K3G��=_�,�> ��k         �   x�=���0���+�&�5���Hp�f-�ƴ��뀺����ܙ�bw�Ɋ|������6����YD,�*_�-�Kw1��e�B"!\-vR�_�',�E����{l��Ni�K(�{����Ŗ'�
�>f=�)�)Ī����A�����>
rҲ|I��]Ώq�W�M��X�Ǆ1��
R�         J   x���4426�,I-.�y霆����\�@)CC��(X�0�H�u���9�S`ڌ �fp� 9c�\� ���         @  x����r�P��^G���]#�V6̃���p����貗�_�S���H@ѫ[���s�57p��7�x�gt�5�<
�بr5�٧We;K�9@�t�qyכ��s@�V�|�*㾾M�+kU�٣�Z?Ɣ~d#��(�#�Y�!�<�w�߄��t2����b�'[��ӳ7�jG�sr���?���=I�z��F5�M!Ba�m�շ�t�ť^]Ƿ?����256w)�b�
1d������v�!1g�4���O
�}���E�_�X�����q�l����ڽ� w(Р�^�v�6���[������e���..����h�Z���L=]7�M�u�6>U_J�L���,b�h>�'����{u?���:7����dow7�����Q��bO�nm��:&��� \���ny�_;�}�'4MD@���C�+�8EW�4HMr��(f����;��3��"�UA<
/Uxy����'0�%v-��[������ yїǠb0��^�������"�?�cn��l A����x�k<�9ڽj�S	�f��V�����S�8��7�^�� ��/�     