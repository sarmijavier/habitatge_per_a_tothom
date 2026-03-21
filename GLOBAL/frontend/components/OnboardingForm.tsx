import type { CountryDefinition, OnboardingProfile } from "../lib/types";

type OnboardingFormProps = {
  countries: CountryDefinition[];
  onSubmit: (payload: {
    profile: OnboardingProfile;
    focusCountryId: string;
    wantsHousingAccessHelp: boolean;
  }) => void;
  loading: boolean;
};

export function OnboardingForm({
  countries,
  onSubmit,
  loading,
}: OnboardingFormProps) {
  return (
    <section className="card" style={{ padding: 24 }}>
      <div className="eyebrow">Onboarding</div>
      <h2 className="title" style={{ fontSize: "2.2rem" }}>
        GLOBAL adapta tono, profundidad y foco país desde el primer turno
      </h2>
      <p className="muted">
        Elige el perfil con el que quieres entrar y el país objetivo inicial.
        Después podrás pedir más detalle, ver datos o simular impactos.
      </p>

      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          onSubmit({
            profile: String(formData.get("profile")) as OnboardingProfile,
            focusCountryId: String(formData.get("focus_country_id")),
            wantsHousingAccessHelp: formData.get("wants_housing_access_help") === "on",
          });
        }}
      >
        <div className="meta-grid">
          <label className="meta-card card stack">
            <strong>Perfil</strong>
            <select name="profile" defaultValue="citizen" className="textarea" style={{ minHeight: 0 }}>
              <option value="citizen">Curiosidad / ciudadano</option>
              <option value="academic">Estudio / académico</option>
              <option value="professional">Profesional / estratégico</option>
            </select>
          </label>

          <label className="meta-card card stack">
            <strong>País foco</strong>
            <select
              name="focus_country_id"
              defaultValue="es"
              className="textarea"
              style={{ minHeight: 0 }}
            >
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="pill" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input type="checkbox" name="wants_housing_access_help" />
          Activar también el flujo ciudadano “Vivienda Clara”
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Creando sesión..." : "Entrar en GLOBAL"}
        </button>
      </form>
    </section>
  );
}
