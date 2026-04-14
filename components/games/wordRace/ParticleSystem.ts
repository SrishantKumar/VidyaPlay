export interface Particle {
  x: number;
  y: number;
  opacity: number;
  size: number;
  vx: number;
  vy: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private readonly maxParticles = 18;

  emit(carX: number, carY: number, carHeight: number, isBoosting: boolean) {
    const count = isBoosting ? 3 : 1;

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }
      this.particles.push({
        x: carX - 6 + Math.random() * 10,
        y: carY + carHeight - 4 + Math.random() * 8,
        opacity: isBoosting ? 0.75 : 0.40,
        size: isBoosting ? 10 : 5,
        vx: -(1.5 + Math.random() * 2),
        vy: Math.random() * 1.6 - 0.8,
      });
    }
  }

  update() {
    this.particles = this.particles
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        opacity: p.opacity - 0.025,
        size: p.size * 0.97,
      }))
      .filter(p => p.opacity > 0.01);
  }

  getParticles(): Particle[] {
    return this.particles;
  }

  clear() {
    this.particles = [];
  }
}
