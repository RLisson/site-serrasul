"use client";

import { MouseEvent, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tv,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import logo from "../public/LOGO.png";

const navigation = [
  { label: "Planos", href: "#planos" },
  { label: "Móvel e Fixo", href: "#movel-fixo" },
  { label: "Ferramentas", href: "#ferramentas" },
  { label: "Contato", href: "#contato" },
];

const internetPlans = [
  {
    name: "400 Mega",
    price: "R$ 119,90",
    description: "Fibra estável para streaming, aulas e home office com muita fluidez.",
    highlight: false,
    benefits: ["Wi-Fi de alta performance", "Instalação rápida", "Suporte local"],
  },
  {
    name: "800 Mega",
    price: "R$ 159,90",
    description: "A opção mais completa para famílias conectadas, jogos e múltiplas telas.",
    highlight: true,
    benefits: ["Upload turbinado", "Menor latência", "Prioridade no atendimento"],
  },
  {
    name: "1 Giga",
    price: "R$ 199,90",
    description: "Velocidade máxima para quem quer experiência premium sem travamentos.",
    highlight: false,
    benefits: ["Ultra velocidade", "Cobertura para casa toda", "Roteador incluso"],
  },
];

const mobilePlans = [
  {
    title: "Plano 30 GB",
    description: "Dados de sobra com WhatsApp grátis para conversar sem gastar da franquia.",
  },
  {
    title: "Plano 50 GB",
    description: "Ideal para redes sociais, vídeos curtos, chamadas e navegação intensa.",
  },
  {
    title: "Fixo Ilimitado",
    description: "Ligações ilimitadas para fixo e móvel com praticidade no dia a dia.",
  },
];

const telefoniaFixa = [
  {
    title: "Plano 200min",
    description: "200 minutos mensais para ligações locais e nacionais, com qualidade garantida.",
    value: "R$ 39,90/mês",
  },
  {
    title: "Plano 500min",
    description: "500 minutos para falar com quem quiser, ideal para famílias e pequenas empresas.",
    value: "R$ 69,90/mês",
  },
  {
    title: "Plano Ilimitado",
    description: "Ligações ilimitadas para fixo e móvel, ideal para quem fala muito e quer economia.",
    value: "R$ 99,90/mês",
  }
]

const footerLinks = ["Sobre a Serrasul", "Planos", "Teste de Velocidade", "Status da Rede"];

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [testeExecutado, setTesteExecutado] = useState(false);
  
  function handleSendMessage(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    window.open("https://wa.me/5500000000000", "_blank");
  }

  return (
    <main className="min-h-screen bg-(--color-light) text-(--color-medium)">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-(--color-medium) backdrop-blur-xl shadow-[0_10px_30px_rgba(var(--color-medium-rgb),0.18)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2 text-white">
            <div>
              <Image src={logo} alt="Logo da Serrasul Telecom" className="h-10 w-auto" priority />
            </div>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-white transition hover:transform hover:-translate-y-0.5 hover:text-white/80"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="#cliente"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Área do Cliente
            </a>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-full bg-(--color-orange) px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(var(--color-orange-rgb),0.3)] transition hover:bg-[var(--color-orange-light)]"
            >
              Falar com Consultor
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/5 lg:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={`overflow-hidden border-t border-white/10 bg-(--color-medium) transition-all duration-300 lg:hidden ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#cliente"
              className="mt-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white"
            >
              Área do Cliente
            </a>
          </div>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden bg-(--color-medium) text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(var(--color-orange-rgb),0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(var(--color-medium-rgb),0.35),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_48%)]" />
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgba(var(--color-orange-rgb),0.2)] blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
              <Sparkles className="h-4 w-4 text-(--color-orange)" />
              Internet + TV com atendimento local e instalação ágil
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-7xl">
              Navegue na Velocidade da Luz. E a TV? É por Nossa Conta.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/75 sm:text-xl">
              Planos de fibra pensados para quem quer velocidade real, estabilidade e uma experiência completa com TV
              inclusa. Conecte a casa inteira com um provedor local que entende o que importa no dia a dia.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#planos"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-orange)] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-[rgba(var(--color-orange-rgb),0.3)] transition hover:-translate-y-0.5 hover:bg-[var(--color-orange-light)]"
              >
                Ver Planos
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#contato"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com Consultor
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { value: "100%", label: "Foco em estabilidade" },
                { value: "24h", label: "Suporte local" },
                { value: "TV", label: "Inclusa em todos os planos" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-2xl font-black text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-white/65">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex justify-center h-full bg-[--color-light]">
            <div className="relative w-full max-w-xl rounded-4xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between rounded-3xl bg-[rgb(var(--color-medium-rgb))] px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">TV Serrasul</p>
                  <p className="text-sm font-semibold text-white">Sua TV em qualquer tela</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <ShieldCheck className="h-4 w-4 text-(--color-orange)" />
                  Conteúdo liberado
                </div>
              </div>
              <div className="mt-4 grid gap-4 ">
                <div className="grid gap-4">
                  {[
                    { label: "Streaming fluido", value: "Sem travamentos", icon: Wifi },
                    { label: "TV inclusa", value: "Em todos os planos", icon: Tv },
                    { label: "Atendimento local", value: "Fácil e rápido", icon: Phone },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-3xl border border-white/10 bg-[var(--color-medium)] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[var(--color-orange)]">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm text-white/55">{label}</p>
                          <p className="text-base font-semibold text-white">{value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="planos" className="bg-[var(--color-light)] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[var(--color-medium)]">Internet + TV</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--color-medium)] sm:text-5xl">
              Planos prontos para ganhar velocidade e retenção.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[var(--color-medium)]/75">
              Estrutura comercial pensada para conversão: destaque visual no plano preferido, benefícios claros e TV
              grátis evidente em cada opção.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {internetPlans.map((plan) => (
              <article
                key={plan.name}
                className={`relative overflow-hidden rounded-4xl border bg-white p-6 shadow-[0_20px_50px_rgba(33,38,64,0.08)] transition hover:-translate-y-1 ${plan.highlight ? "border-[#F25F29] ring-2 ring-[#F25F29]/10" : "border-[var(--color-medium)]/10"
                  }`}
              >
                {plan.highlight ? (
                  <div className="absolute right-4 top-4 rounded-full bg-[#F25F29] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#F25F29]/30">
                    Mais Popular
                  </div>
                ) : null}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0367A6]">Plano Fibra</p>
                    <h3 className="mt-2 text-3xl font-black text-[#212640]">{plan.name}</h3>
                  </div>
                  <div className="rounded-2xl bg-[var(--color-medium)]/5 p-3 text-[#0367A6]">
                    <Zap className="h-6 w-6" />
                  </div>
                </div>

                <div className={`mt-6 rounded-3xl  p-5 text-white shadow-inner shadow-black/20 ${plan.highlight ? 'bg-(--color-orange)' : 'bg-(--color-medium)'}`}>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/45">A partir de</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="pb-1 text-sm text-white/60">/mês</span>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-[var(--color-medium)]/75">{plan.description}</p>

                <div className="mt-5 rounded-[1.35rem] border-2 border-dashed border-[#F25F29]/40 bg-[#F25F29]/8 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F25F29] text-white shadow-lg shadow-[#F25F29]/20">
                      <Tv className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#F25F29]">
                        Pacote de TV Grátis Incluso
                      </p>
                      <p className="mt-1 text-sm font-semibold text-(--color-medium)">TV Serrasul liberado no seu plano</p>
                    </div>
                  </div>
                </div>

                <ul className="mt-5 space-y-3">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm text-[var(--color-medium)]/80">
                      <CheckCircle2 className="h-5 w-5 flex-none text-[#F25F29]" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contato"
                  className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-bold transition ${plan.highlight
                    ? "bg-[#F25F29] text-white shadow-lg shadow-[#F25F29]/25 hover:bg-[#F25A38]"
                    : "bg-[var(--color-medium)] text-white hover:bg-[#0367A6]"
                    }`}
                >
                  Quero esse plano
                  <ChevronRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="movel-fixo" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
            <div className="rounded-4xl bg-[var(--color-medium)] p-8 text-white shadow-[0_20px_50px_rgba(33,38,64,0.18)]">
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-[var(--color-orange)]">Fixo</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Planos de telefonia fixa, para suas chamadas.</h2>

              <div className="mt-8 space-y-4">
                {telefoniaFixa.map((plan) => (
                  <div key={plan.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-orange)] text-white">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{plan.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-white/65">{plan.description}</p>
                        <p className="mt-2 text-sm font-bold text-white">{plan.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-6 flex items-center justify-center">
                  <button onClick={(e) => handleSendMessage(e)} className="rounded-full bg-[var(--color-orange)] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#F25F29]/30 transition hover:bg-[#F25A38] hover:translate-x-0.5 hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer">
                    Fale com nossos consultores
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <article className="rounded-4xl border border-[var(--color-medium)]/10 bg-[var(--color-light)] p-6 shadow-[0_16px_40px_rgba(33,38,64,0.08)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-medium)] text-white">
                  <Smartphone className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-2xl font-black text-[var(--color-medium)]">Internet móvel com GB de verdade</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-medium)]/70">
                  Planos com franquia ampla para streaming, navegação e videochamadas, sempre com WhatsApp grátis para
                  não perder contato.
                </p>
                <div className="mt-5 space-y-3 text-sm text-[var(--color-medium)]/80">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-orange)]" />
                    WhatsApp grátis incluso
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-orange)]" />
                    Até 50 GB para navegar sem preocupação
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-orange)]" />
                    Ideal para vendas e upgrades recorrentes
                  </p>
                </div>
              </article>

              <article className="rounded-4xl border border-[var(--color-medium)]/10 bg-white p-6 shadow-[0_16px_40px_rgba(33,38,64,0.08)] md:col-span-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-orange)] text-white">
                  <Phone className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-2xl font-black text-[var(--color-medium)]">Telefonia fixa ilimitada</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-medium)]/70">
                  Ligações ilimitadas para fixo e móvel com estabilidade e excelente custo-benefício para casa e
                  empresa.
                </p>
                <div className="mt-5 rounded-3xl bg-[var(--color-medium)] p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">Destaque comercial</p>
                  <p className="mt-2 text-xl font-black">Mais economia para quem fala muito.</p>
                </div>
              </article>

              <article className="rounded-4xl border border-[var(--color-medium)]/10 bg-[linear-gradient(160deg,var(--color-medium),var(--color-medium))] p-6 text-white shadow-[0_16px_40px_rgba(33,38,64,0.14)] md:col-span-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <Wifi className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-2xl font-black">Combinação ideal para a família</h3>
                <p className="mt-3 text-sm leading-7 text-white/78">
                  Internet residencial, chip móvel e telefonia fixa sob a mesma proposta de valor para aumentar ticket
                  e retenção.
                </p>
                <a
                  href="#contato"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#212640] transition hover:translate-x-0.5"
                >
                  Montar combo
                  <ChevronRight className="h-4 w-4" />
                </a>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="ferramentas" className="bg-[var(--color-light)] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[var(--color-medium)]">Ferramentas extras</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--color-medium)] sm:text-5xl">
              Dois atalhos para reforçar confiança e conversão.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <a
              href="#"
              className="group rounded-4xl bg-white p-7 shadow-[0_20px_50px_rgba(33,38,64,0.08)] transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-orange)] text-white shadow-lg shadow-[#F25F29]/20">
                    <Zap className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-[#212640]">Speedtest Serrasul</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-[#212640]/70">
                    Mostre a velocidade real da conexão e fortaleça a percepção de qualidade com uma experiência simples
                    e objetiva.
                  </p>
                </div>
              </div>
              {testeExecutado ? (
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    ["Download", "940 Mbps"],
                    ["Upload", "860 Mbps"],
                    ["Ping", "5 ms"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-[var(--color-medium)] p-4 text-center text-white">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/45">{label}</p>
                      <p className="mt-2 text-lg font-black">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex items-center justify-center">
                  <button
                    onClick={() => setTesteExecutado(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-(--color-orange) px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#F25F29]/30 transition hover:bg-[#F25A38]"
                  >
                    Iniciar teste
                    <Zap className="h-4 w-4" />
                  </button>
                </div>
              )
              }
            </a>

            <a
              href="#"
              className="group rounded-4xl bg-[linear-gradient(160deg,var(--color-medium),var(--color-medium))] p-7 text-white shadow-[0_20px_50px_rgba(33,38,64,0.14)] transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[var(--color-orange)]">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-2xl font-black">Status da Rede</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/72">
                    Indique operação em tempo real com animação de ping e reforço de disponibilidade máxima.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-(--color-success)/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-(--color-success)">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--color-success)]" />
                  </span>
                  100% Operacional
                </div>
              </div>

              <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Rede principal</span>
                  <span className="font-semibold text-[var(--color-success)]">Sem ocorrências</span>
                </div>
                <div className="mt-4 h-28 rounded-[1.4rem] bg-[radial-gradient(circle_at_50%_30%,rgba(124,255,178,0.25),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
                  <div className="flex h-full items-center justify-center">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                      <div className="absolute inset-0 rounded-full border border-[var(--color-success)]/40 animate-ping" />
                      <div className="absolute inset-2 rounded-full border border-white/15" />
                      <Clock3 className="h-8 w-8 text-[var(--color-success)]" />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <footer id="contato" className="bg-[var(--color-medium)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-orange)] font-black text-white">
                  SS
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/45">Serrasul.</p>
                  <p className="text-lg font-semibold">Telecom</p>
                </div>
              </div>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">
                Provedor local de internet, TV, móvel e telefonia com foco em experiência, estabilidade e conversão.
              </p>
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-orange)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-orange-light)]"
              >
                <MessageCircle className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.35em] text-white/45">Links úteis</h3>
              <ul className="mt-5 space-y-3 text-sm text-white/72">
                {footerLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.35em] text-white/45">Contato</h3>
              <ul className="mt-5 space-y-3 text-sm text-white/72">
                <li>(00) 0000-0000</li>
                <li>contato@serrasul.com.br</li>
                <li>CNPJ: 00.000.000/0001-00</li>
                <li>Rua Exemplo, 123 - Centro</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/50">
            © {new Date().getFullYear()} Serrasul Telecom. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/5500000000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Serrasul no WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-whatsapp)] text-white shadow-[0_18px_40px_rgba(37,211,102,0.35)] transition hover:-translate-y-1 hover:bg-[var(--color-whatsapp)]/90"
      >
        <MessageCircle className="h-8 w-8" />
      </a>
    </main>
  );
}
