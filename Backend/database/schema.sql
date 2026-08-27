--
-- PostgreSQL database dump
--

\restrict ThcqaM2BEzZo9assQ1mfXCnjHNyVB1dNScId6lhYGGqa4g04OTkxLoq2d9BNVjL

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

-- Started on 2026-08-26 10:43:15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 236 (class 1259 OID 24581)
-- Name: bloques; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bloques (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.bloques OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 24580)
-- Name: bloques_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bloques_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bloques_id_seq OWNER TO postgres;

--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 235
-- Name: bloques_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bloques_id_seq OWNED BY public.bloques.id;


--
-- TOC entry 224 (class 1259 OID 16589)
-- Name: docente_materias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.docente_materias (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    materia_id integer NOT NULL
);


ALTER TABLE public.docente_materias OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16588)
-- Name: docente_materias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.docente_materias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.docente_materias_id_seq OWNER TO postgres;

--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 223
-- Name: docente_materias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.docente_materias_id_seq OWNED BY public.docente_materias.id;


--
-- TOC entry 230 (class 1259 OID 16651)
-- Name: historial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial (
    id integer NOT NULL,
    solicitud_id integer NOT NULL,
    docente_id integer NOT NULL,
    salon_id integer NOT NULL,
    materia_id integer NOT NULL,
    hora_inicio timestamp without time zone NOT NULL,
    hora_fin timestamp without time zone NOT NULL,
    registrado_en timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.historial OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16650)
-- Name: historial_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_id_seq OWNER TO postgres;

--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 229
-- Name: historial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_id_seq OWNED BY public.historial.id;


--
-- TOC entry 222 (class 1259 OID 16580)
-- Name: materias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materias (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    codigo character varying(20) NOT NULL
);


ALTER TABLE public.materias OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16579)
-- Name: materias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.materias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.materias_id_seq OWNER TO postgres;

--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 221
-- Name: materias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.materias_id_seq OWNED BY public.materias.id;


--
-- TOC entry 232 (class 1259 OID 16682)
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificaciones (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    solicitud_id integer,
    tipo character varying(40) NOT NULL,
    mensaje text NOT NULL,
    leida boolean DEFAULT false NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notificaciones OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16681)
-- Name: notificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificaciones_id_seq OWNER TO postgres;

--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 231
-- Name: notificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificaciones_id_seq OWNED BY public.notificaciones.id;


--
-- TOC entry 218 (class 1259 OID 16552)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16551)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 226 (class 1259 OID 16608)
-- Name: salones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salones (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    bloque character varying(50) NOT NULL,
    capacidad integer DEFAULT 30 NOT NULL,
    disponible boolean DEFAULT true NOT NULL,
    piso integer DEFAULT 1,
    bloque_id integer
);


ALTER TABLE public.salones OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16607)
-- Name: salones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salones_id_seq OWNER TO postgres;

--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 225
-- Name: salones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salones_id_seq OWNED BY public.salones.id;


--
-- TOC entry 228 (class 1259 OID 16617)
-- Name: solicitudes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitudes (
    id integer NOT NULL,
    docente_id integer NOT NULL,
    salon_id integer NOT NULL,
    materia_id integer NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    hora_solicitud timestamp without time zone DEFAULT now() NOT NULL,
    hora_inicio timestamp without time zone,
    hora_fin timestamp without time zone,
    aprobado_por integer,
    CONSTRAINT estado_valido CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'aprobada'::character varying, 'rechazada'::character varying, 'finalizada'::character varying])::text[])))
);


ALTER TABLE public.solicitudes OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16616)
-- Name: solicitudes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitudes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solicitudes_id_seq OWNER TO postgres;

--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 227
-- Name: solicitudes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitudes_id_seq OWNED BY public.solicitudes.id;


--
-- TOC entry 220 (class 1259 OID 16561)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    rol_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    fcm_token character varying(255),
    apellidos character varying(150) NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16560)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 234 (class 1259 OID 16708)
-- Name: vista_docentes_materias; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_docentes_materias AS
 SELECT u.id AS docente_id,
    u.nombre AS docente,
    u.email,
    u.activo,
    array_agg(m.nombre ORDER BY m.nombre) AS materias
   FROM (((public.usuarios u
     JOIN public.roles r ON (((r.id = u.rol_id) AND ((r.nombre)::text = 'docente'::text))))
     LEFT JOIN public.docente_materias dm ON ((dm.usuario_id = u.id)))
     LEFT JOIN public.materias m ON ((m.id = dm.materia_id)))
  GROUP BY u.id, u.nombre, u.email, u.activo;


ALTER VIEW public.vista_docentes_materias OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16703)
-- Name: vista_historial; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_historial AS
 SELECT h.id,
    u.nombre AS docente,
    s.nombre AS salon,
    s.bloque,
    m.nombre AS materia,
    h.hora_inicio,
    h.hora_fin,
    (EXTRACT(epoch FROM (h.hora_fin - h.hora_inicio)) / (60)::numeric) AS duracion_minutos,
    h.registrado_en
   FROM (((public.historial h
     JOIN public.usuarios u ON ((u.id = h.docente_id)))
     JOIN public.salones s ON ((s.id = h.salon_id)))
     JOIN public.materias m ON ((m.id = h.materia_id)))
  ORDER BY h.hora_inicio DESC;


ALTER VIEW public.vista_historial OWNER TO postgres;

--
-- TOC entry 4808 (class 2604 OID 24584)
-- Name: bloques id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloques ALTER COLUMN id SET DEFAULT nextval('public.bloques_id_seq'::regclass);


--
-- TOC entry 4795 (class 2604 OID 16592)
-- Name: docente_materias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docente_materias ALTER COLUMN id SET DEFAULT nextval('public.docente_materias_id_seq'::regclass);


--
-- TOC entry 4803 (class 2604 OID 16654)
-- Name: historial id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial ALTER COLUMN id SET DEFAULT nextval('public.historial_id_seq'::regclass);


--
-- TOC entry 4794 (class 2604 OID 16583)
-- Name: materias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias ALTER COLUMN id SET DEFAULT nextval('public.materias_id_seq'::regclass);


--
-- TOC entry 4805 (class 2604 OID 16685)
-- Name: notificaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones ALTER COLUMN id SET DEFAULT nextval('public.notificaciones_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 16555)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4796 (class 2604 OID 16611)
-- Name: salones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salones ALTER COLUMN id SET DEFAULT nextval('public.salones_id_seq'::regclass);


--
-- TOC entry 4800 (class 2604 OID 16620)
-- Name: solicitudes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes ALTER COLUMN id SET DEFAULT nextval('public.solicitudes_id_seq'::regclass);


--
-- TOC entry 4791 (class 2604 OID 16564)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4845 (class 2606 OID 24590)
-- Name: bloques bloques_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloques
    ADD CONSTRAINT bloques_nombre_key UNIQUE (nombre);


--
-- TOC entry 4847 (class 2606 OID 24588)
-- Name: bloques bloques_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloques
    ADD CONSTRAINT bloques_pkey PRIMARY KEY (id);


--
-- TOC entry 4825 (class 2606 OID 16594)
-- Name: docente_materias docente_materias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docente_materias
    ADD CONSTRAINT docente_materias_pkey PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 16596)
-- Name: docente_materias docente_materias_usuario_id_materia_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docente_materias
    ADD CONSTRAINT docente_materias_usuario_id_materia_id_key UNIQUE (usuario_id, materia_id);


--
-- TOC entry 4837 (class 2606 OID 16657)
-- Name: historial historial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT historial_pkey PRIMARY KEY (id);


--
-- TOC entry 4821 (class 2606 OID 16587)
-- Name: materias materias_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_codigo_key UNIQUE (codigo);


--
-- TOC entry 4823 (class 2606 OID 16585)
-- Name: materias materias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_pkey PRIMARY KEY (id);


--
-- TOC entry 4843 (class 2606 OID 16691)
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4812 (class 2606 OID 16559)
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- TOC entry 4814 (class 2606 OID 16557)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4829 (class 2606 OID 16615)
-- Name: salones salones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salones
    ADD CONSTRAINT salones_pkey PRIMARY KEY (id);


--
-- TOC entry 4835 (class 2606 OID 16625)
-- Name: solicitudes solicitudes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_pkey PRIMARY KEY (id);


--
-- TOC entry 4817 (class 2606 OID 16572)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4819 (class 2606 OID 16570)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4838 (class 1259 OID 16678)
-- Name: idx_historial_docente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_docente ON public.historial USING btree (docente_id);


--
-- TOC entry 4839 (class 1259 OID 16680)
-- Name: idx_historial_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_fecha ON public.historial USING btree (hora_inicio);


--
-- TOC entry 4840 (class 1259 OID 16679)
-- Name: idx_historial_salon; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_salon ON public.historial USING btree (salon_id);


--
-- TOC entry 4841 (class 1259 OID 16702)
-- Name: idx_notificaciones_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notificaciones_usuario ON public.notificaciones USING btree (usuario_id);


--
-- TOC entry 4830 (class 1259 OID 16646)
-- Name: idx_solicitudes_docente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_solicitudes_docente ON public.solicitudes USING btree (docente_id);


--
-- TOC entry 4831 (class 1259 OID 16648)
-- Name: idx_solicitudes_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_solicitudes_estado ON public.solicitudes USING btree (estado);


--
-- TOC entry 4832 (class 1259 OID 16649)
-- Name: idx_solicitudes_hora; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_solicitudes_hora ON public.solicitudes USING btree (hora_solicitud);


--
-- TOC entry 4833 (class 1259 OID 16647)
-- Name: idx_solicitudes_salon; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_solicitudes_salon ON public.solicitudes USING btree (salon_id);


--
-- TOC entry 4815 (class 1259 OID 16578)
-- Name: idx_usuarios_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_email ON public.usuarios USING btree (email);


--
-- TOC entry 4849 (class 2606 OID 16602)
-- Name: docente_materias docente_materias_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docente_materias
    ADD CONSTRAINT docente_materias_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id) ON DELETE CASCADE;


--
-- TOC entry 4850 (class 2606 OID 16597)
-- Name: docente_materias docente_materias_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docente_materias
    ADD CONSTRAINT docente_materias_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4851 (class 2606 OID 24591)
-- Name: salones fk_bloque; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salones
    ADD CONSTRAINT fk_bloque FOREIGN KEY (bloque_id) REFERENCES public.bloques(id);


--
-- TOC entry 4856 (class 2606 OID 16663)
-- Name: historial historial_docente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT historial_docente_id_fkey FOREIGN KEY (docente_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4857 (class 2606 OID 16673)
-- Name: historial historial_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT historial_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id);


--
-- TOC entry 4858 (class 2606 OID 16668)
-- Name: historial historial_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT historial_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salones(id);


--
-- TOC entry 4859 (class 2606 OID 16658)
-- Name: historial historial_solicitud_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT historial_solicitud_id_fkey FOREIGN KEY (solicitud_id) REFERENCES public.solicitudes(id);


--
-- TOC entry 4860 (class 2606 OID 16697)
-- Name: notificaciones notificaciones_solicitud_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_solicitud_id_fkey FOREIGN KEY (solicitud_id) REFERENCES public.solicitudes(id);


--
-- TOC entry 4861 (class 2606 OID 16692)
-- Name: notificaciones notificaciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4852 (class 2606 OID 16641)
-- Name: solicitudes solicitudes_aprobado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_aprobado_por_fkey FOREIGN KEY (aprobado_por) REFERENCES public.usuarios(id);


--
-- TOC entry 4853 (class 2606 OID 16626)
-- Name: solicitudes solicitudes_docente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_docente_id_fkey FOREIGN KEY (docente_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4854 (class 2606 OID 16636)
-- Name: solicitudes solicitudes_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id);


--
-- TOC entry 4855 (class 2606 OID 16631)
-- Name: solicitudes solicitudes_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salones(id);


--
-- TOC entry 4848 (class 2606 OID 16573)
-- Name: usuarios usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id);


-- Completed on 2026-08-26 10:43:15

--
-- PostgreSQL database dump complete
--

\unrestrict ThcqaM2BEzZo9assQ1mfXCnjHNyVB1dNScId6lhYGGqa4g04OTkxLoq2d9BNVjL

