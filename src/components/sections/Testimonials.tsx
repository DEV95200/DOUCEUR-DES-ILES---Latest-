import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Star, Quote } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import { SectionHeading } from "../ui/SectionHeading";
import { WaveDivider } from "../ui/WaveDivider";
import { testimonials } from "../../data/testimonials";

export function Testimonials() {
  return (
    <section id="avis" className="relative overflow-hidden px-6 py-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Ils ont goûté"
          title="Des îles jusque dans votre assiette"
          tagline="Ce que nos clients racontent après leur première commande."
        />

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="kala-swiper mt-16 pb-14"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="flex h-full flex-col gap-4 rounded-3xl bg-white p-7 shadow-md ring-1 ring-kala-ink/5">
                <Quote className="text-kala-lime-dark" size={28} />
                <p className="flex-1 text-sm leading-relaxed text-kala-ink/75">
                  “{testimonial.quote}”
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < testimonial.rating
                          ? "fill-kala-mango text-kala-mango"
                          : "text-kala-ink/20"
                      }
                    />
                  ))}
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-kala-ink">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-kala-ink/50">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <WaveDivider color="#8fe3b0" />
    </section>
  );
}
