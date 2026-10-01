package com.treino.api.treino.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exercicio")
public class Exercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String observacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dia_treino_id", nullable = false)
    private DiaTreino diaTreino;

    @OneToMany(mappedBy = "exercicio", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("numero ASC")
    @BatchSize(size = 30)
    private final List<Serie> series = new ArrayList<>();

    protected Exercicio() {
        // exigido pelo JPA/Hibernate
    }

    public Exercicio(String nome, String observacao) {
        this.nome = nome;
        this.observacao = observacao;
    }

    void vincularAoDia(DiaTreino diaTreino) {
        this.diaTreino = diaTreino;
    }

    public void atualizarDados(String nome, String observacao) {
        this.nome = nome;
        this.observacao = observacao;
    }

    public void adicionarSerie(Serie serie) {
        serie.vincularAoExercicio(this);
        serie.definirNumero(proximoNumeroDeSerie());
        this.series.add(serie);
    }

    public void removerSerie(Serie serie) {
        this.series.remove(serie);
    }

    private int proximoNumeroDeSerie() {
        int maiorNumero = 0;
        for (Serie serieExistente : series) {
            if (serieExistente.getNumero() > maiorNumero) {
                maiorNumero = serieExistente.getNumero();
            }
        }
        return maiorNumero + 1;
    }

    public Long getId() {return id;}

    public String getNome() {return nome;}

    public String getObservacao() {return observacao;}

    public DiaTreino getDiaTreino() {return diaTreino;}

    public List<Serie> getSeries() {
        return List.copyOf(series);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }
        if (!(outro instanceof Exercicio outroExercicio)) {
            return false;
        }
        return id != null && id.equals(outroExercicio.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Exercicio{id=%d, nome='%s'}".formatted(id, nome);
    }
}