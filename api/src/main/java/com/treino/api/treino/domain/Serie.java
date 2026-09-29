package com.treino.api.treino.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "serie")
public class Serie {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer numero;

    private Integer repeticoes;

    private Double carga;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "exercicio_id", nullable = false)
    private Exercicio exercicio;

    protected Serie() {
        // exigido pelo JPA/Hibernate
    }

    public Serie(Integer repeticoes, Double carga) {
        this.repeticoes = repeticoes;
        this.carga = carga;
    }

    void vincularAoExercicio(Exercicio exercicio) {
        this.exercicio = exercicio;
    }

    void definirNumero(int numero) {
        this.numero = numero;
    }

    public void atualizarDados(Integer numero, Integer repeticoes, Double carga) {
        this.numero = numero;
        this.repeticoes = repeticoes;
        this.carga = carga;
    }

    public Long getId() {return id;}

    public Integer getNumero() {return numero;}

    public Integer getRepeticoes() {return repeticoes;}

    public Double getCarga() {return carga;}

    public Exercicio getExercicio() {return exercicio;}

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }
        if (!(outro instanceof Serie outraSerie)) {
            return false;
        }
        return id != null && id.equals(outraSerie.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Serie{id=%d, numero=%d, repeticoes=%d, carga=%s}".formatted(id, numero, repeticoes, carga);
    }
}